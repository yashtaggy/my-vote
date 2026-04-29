"""Core configuration using environment variables."""

from pydantic_settings import BaseSettings
from typing import List
import os


class Settings(BaseSettings):
    # App
    APP_NAME: str = "MyVote Journey API"
    DEBUG: bool = False

    # CORS
    ALLOWED_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ]

    # Google Gemini
    GEMINI_API_KEY: str = ""

    # Google Maps
    GOOGLE_MAPS_API_KEY: str = ""

    # Redis
    REDIS_URL: str = "redis://localhost:6379"

    # Supabase / Postgres (optional for full setup)
    DATABASE_URL: str = "sqlite:///./myvote.db"
    SUPABASE_URL: str = ""
    SUPABASE_KEY: str = ""

    class Config:
        env_file = ".env"
        case_sensitive = True


settings = Settings()
