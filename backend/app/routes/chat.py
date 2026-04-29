"""RAG-based AI chat endpoint using Google Gemini."""

from fastapi import APIRouter
from slowapi import Limiter
from slowapi.util import get_remote_address

from app.schemas import ChatRequest, ChatResponse, SourceDoc
from app.services.rag import rag_engine, generate_answer

router = APIRouter()


@router.post("/chat", response_model=ChatResponse)
async def chat(payload: ChatRequest):
    """
    RAG-based Q&A endpoint.
    1. Retrieves relevant documents from vector store.
    2. Passes them with user query to Gemini.
    3. Returns structured response.
    """
    # Retrieve relevant docs
    docs = await rag_engine.retrieve(payload.message, top_k=3)

    # Generate answer
    result = await generate_answer(
        query=payload.message,
        context_docs=docs,
        language=payload.language,
    )

    sources = [
        SourceDoc(
            title=d["title"],
            source=d["source"],
            url=d["url"],
        )
        for d in result.get("sources", docs[:2])
    ] if result.get("sources") else [
        SourceDoc(title=d["title"], source=d["source"], url=d["url"])
        for d in docs[:2]
    ]

    return ChatResponse(
        answer=result.get("answer", "No verified information found."),
        steps=result.get("steps", []),
        documents_required=result.get("documents_required", []),
        timeline=result.get("timeline"),
        sources=sources,
        disclaimer="This information is sourced from ECI official documents. Always verify at eci.gov.in or voters.eci.gov.in.",
    )
