"""
MyVote Journey - FastAPI Backend
Entry point for the election education assistant API.
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
import uvicorn

from app.routes import onboard, dashboard, journey, quiz, chat, simulate, election_info
from app.core.config import settings

# Rate limiter
limiter = Limiter(key_func=get_remote_address)

app = FastAPI(
    title="MyVote Journey API",
    description="Election Process Education Assistant — India First",
    version="1.0.0",
    docs_url="/api/docs",
    redoc_url="/api/redoc",
)

# Attach rate limiter
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routers
app.include_router(onboard.router, prefix="/api/v1", tags=["Onboarding"])
app.include_router(dashboard.router, prefix="/api/v1", tags=["Dashboard"])
app.include_router(journey.router, prefix="/api/v1", tags=["Journey"])
app.include_router(quiz.router, prefix="/api/v1", tags=["Quiz"])
app.include_router(chat.router, prefix="/api/v1", tags=["AI Chat"])
app.include_router(simulate.router, prefix="/api/v1", tags=["Simulation"])
app.include_router(election_info.router, prefix="/api/v1", tags=["Election Info"])


@app.get("/api/health", tags=["Health"])
async def health_check():
    return {"status": "ok", "service": "MyVote Journey API", "version": "1.0.0"}


if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
