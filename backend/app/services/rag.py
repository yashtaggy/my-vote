"""
RAG pipeline using Google Gemini for embeddings + FAISS for vector search.
Falls back to keyword search if Gemini API is unavailable.
"""

import os
import json
import re
import asyncio
from typing import List, Dict, Tuple, Optional
import numpy as np

from app.core.config import settings
from app.data.election_data import RAG_DOCUMENTS

# Try importing Gemini
try:
    import google.generativeai as genai
    GEMINI_AVAILABLE = bool(settings.GEMINI_API_KEY)
    if GEMINI_AVAILABLE:
        genai.configure(api_key=settings.GEMINI_API_KEY)
except ImportError:
    GEMINI_AVAILABLE = False

# Try importing FAISS
try:
    import faiss
    FAISS_AVAILABLE = True
except ImportError:
    FAISS_AVAILABLE = False


# ─── Simple Embedding Fallback ────────────────────────────────────────────────

def simple_token_embed(text: str, dim: int = 128) -> np.ndarray:
    """Deterministic bag-of-words embedding for keyword fallback."""
    tokens = re.findall(r'\w+', text.lower())
    vec = np.zeros(dim, dtype=np.float32)
    for tok in tokens:
        for i, ch in enumerate(tok):
            vec[ord(ch) % dim] += 1.0
    norm = np.linalg.norm(vec)
    if norm > 0:
        vec /= norm
    return vec


# ─── RAG Engine ───────────────────────────────────────────────────────────────

class RAGEngine:
    def __init__(self):
        self._index = None
        self._docs = RAG_DOCUMENTS
        self._embeddings: List[np.ndarray] = []
        self._dim = 768  # Gemini embedding size

    async def initialize(self):
        """Build the vector index once at startup."""
        embeddings = []
        for doc in self._docs:
            text = doc["title"] + " " + doc["content"]
            emb = await self._embed(text)
            embeddings.append(emb)

        self._embeddings = embeddings
        self._dim = len(embeddings[0]) if embeddings else 128

        if FAISS_AVAILABLE and embeddings:
            mat = np.array(embeddings, dtype=np.float32)
            self._index = faiss.IndexFlatL2(self._dim)
            self._index.add(mat)

    async def _embed(self, text: str) -> np.ndarray:
        """Get embedding vector from Gemini or fallback."""
        if GEMINI_AVAILABLE:
            try:
                result = genai.embed_content(
                    model="models/text-embedding-004",
                    content=text,
                    task_type="retrieval_document",
                )
                return np.array(result["embedding"], dtype=np.float32)
            except Exception:
                pass
        return simple_token_embed(text, dim=128)

    async def retrieve(self, query: str, top_k: int = 3) -> List[Dict]:
        """Retrieve top-k relevant documents for a query."""
        if not self._docs:
            return []

        q_emb = await self._embed(query)

        if FAISS_AVAILABLE and self._index is not None:
            q_mat = np.array([q_emb], dtype=np.float32)
            distances, indices = self._index.search(q_mat, min(top_k, len(self._docs)))
            return [self._docs[i] for i in indices[0] if i < len(self._docs)]

        # Keyword fallback — cosine similarity
        scores = []
        for i, emb in enumerate(self._embeddings):
            norm_q = np.linalg.norm(q_emb)
            norm_d = np.linalg.norm(emb)
            if norm_q > 0 and norm_d > 0:
                score = float(np.dot(q_emb, emb) / (norm_q * norm_d))
            else:
                score = 0.0
            scores.append((score, i))
        scores.sort(reverse=True)
        return [self._docs[i] for _, i in scores[:top_k]]


# ─── Gemini Chat ──────────────────────────────────────────────────────────────

SYSTEM_PROMPT = """You are MyVote Journey, an AI assistant for Indian election education.
Answer ONLY from the provided context documents. 
If the context does not contain the answer, say: "No verified information found for this query. Please visit eci.gov.in for official information."
Be specific, accurate, and cite sources.
Structure your response as valid JSON with keys: answer, steps (list), documents_required (list), timeline, sources (list of {title, source, url}).
"""

async def generate_answer(query: str, context_docs: List[Dict], language: str = "en") -> Dict:
    """Generate structured answer using Gemini and RAG context."""
    if not GEMINI_AVAILABLE or not settings.GEMINI_API_KEY:
        return _fallback_answer(query, context_docs, language)

    context_text = "\n\n---\n\n".join([
        f"Title: {d['title']}\nSource: {d['source']}\nURL: {d['url']}\n\n{d['content']}"
        for d in context_docs
    ])

    lang_instruction = "Respond in Hindi (Devanagari script)." if language == "hi" else "Respond in English."

    prompt = f"""
{SYSTEM_PROMPT}
{lang_instruction}

Context Documents:
{context_text}

User Query: {query}

Return ONLY valid JSON (no markdown, no extra text):
"""

    try:
        model = genai.GenerativeModel("gemini-1.5-flash")
        response = model.generate_content(prompt)
        raw = response.text.strip()
        # Strip markdown code fences if present
        raw = re.sub(r'^```json\s*', '', raw)
        raw = re.sub(r'```\s*$', '', raw)
        data = json.loads(raw)
        return data
    except Exception as e:
        return _fallback_answer(query, context_docs, language)


def _fallback_answer(query: str, context_docs: List[Dict], language: str) -> Dict:
    """Simple rule-based fallback when Gemini is unavailable."""
    if not context_docs:
        return {
            "answer": "No verified information found for this query. Please visit eci.gov.in for official information.",
            "steps": [],
            "documents_required": [],
            "timeline": None,
            "sources": [],
        }

    top = context_docs[0]
    answer = (
        f"Based on official ECI information:\n\n{top['content'][:600]}..."
        if len(top['content']) > 600 else top['content']
    )
    return {
        "answer": answer,
        "steps": [line.strip() for line in top['content'].split('\n') if line.strip().startswith(('1.', '2.', '3.', '4.', '5.', '-'))],
        "documents_required": [],
        "timeline": None,
        "sources": [{"title": d["title"], "source": d["source"], "url": d["url"]} for d in context_docs],
    }


# Global RAG engine instance
rag_engine = RAGEngine()
