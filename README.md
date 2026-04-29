# MyVote Journey — Election Process Education Assistant

## Vertical
Civic Tech / Election Education

## Approach
* **RAG-based AI system**: Uses Google Gemini to retrieve and synthesize election data for user questions, with graceful keyword-fallback when API is unavailable.
* **Rule-based simulation engine**: Interactive deterministic flow guiding voters through EVM button presses, VVPAT verification, and handling error scenarios.
* **Location-aware personalization**: Tailors basic eligibility and state information.

## How It Works
* **User onboarding** → Collects demographics, asserts standard eligibility (18+ citizen check).
* **Guided journey** → 5 distinct, well-documented steps tracking Form 6 registration, roll verification, to polling day EVM voting.
* **AI assistance** → RAG-backed chat using static structured knowledge base compiled from official ECI documents.
* **Election Quiz** → Interactive myths and facts busting.

## Assumptions
* **Limited real-time APIs**: Actual ECI real-time database lookups for individual voters are not accessible; thus, simulated/mock states are implemented.
* **India-first implementation**: Heavy focus on Indian electoral context (ECI, Form 6, NVSP, EVMs, VVPAT, Aadhaar/EPIC).
* **Local Backend/Frontend separation**: Implemented with Next.js frontend proxying calls to FastAPI backend for local hackathon demo purposes.

## Setup Instructions

### Prerequisites
- Node.js (18+)
- Python 3.9+
- Redis (optional, falls back to in-memory cache)

### Environment Variables
**1. Backend (`backend/.env`)**
```env
GEMINI_API_KEY=your_gemini_api_key  # Required for RAG Chat
REDIS_URL=redis://localhost:6379    # Optional
DATABASE_URL=sqlite:///./myvote.db
DEBUG=true
ALLOWED_ORIGINS=["http://localhost:3000","http://127.0.0.1:3000"]
```

**2. Frontend (`frontend/.env.local`)**
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_APP_NAME=MyVote Journey
```

### Installation

**Backend Setup**
```bash
cd backend
python -m venv venv
# Windows: venv\Scripts\activate | Mac/Linux: source venv/bin/activate
pip install -r requirements.txt # (or fast-install via your main dependencies script)
python -c "from app.core.database import init_db; init_db()"
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

**Frontend Setup**
```bash
cd frontend
npm install
npm run dev
```

The application will be accessible at `http://localhost:3000`. API Docs at `http://localhost:8000/api/docs`.

### Tech Stack
* **Frontend:** Next.js (App Router), TypeScript, Tailwind CSS, Lucide Icons
* **Backend:** FastAPI, SQLite (SQLAlchemy), SlowAPI, Redis 
* **AI & Search:** Google Gemini for Embeddings & Chat, FAISS for local Vector Search

---
*Built to empower the next generation of voters with transparent, accessible, and verified information.*
