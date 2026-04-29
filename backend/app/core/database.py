"""
Database setup using SQLAlchemy with SQLite (local dev).
Switch DATABASE_URL to postgres:// for production.
"""

from sqlalchemy import create_engine, Column, String, Integer, Boolean, DateTime, Text, Float
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from datetime import datetime
import uuid

from app.core.config import settings

engine = create_engine(
    settings.DATABASE_URL,
    connect_args={"check_same_thread": False} if "sqlite" in settings.DATABASE_URL else {},
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


# ─── Models ───────────────────────────────────────────────────────────────────

class User(Base):
    __tablename__ = "users"
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    age = Column(Integer)
    state = Column(String)
    city = Column(String)
    pincode = Column(String)
    is_first_time_voter = Column(Boolean, default=True)
    language = Column(String, default="en")
    created_at = Column(DateTime, default=datetime.utcnow)


class StepsProgress(Base):
    __tablename__ = "steps_progress"
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String)
    step_id = Column(Integer)
    step_name = Column(String)
    completed = Column(Boolean, default=False)
    updated_at = Column(DateTime, default=datetime.utcnow)


class QuizQuestion(Base):
    __tablename__ = "quiz_questions"
    id = Column(Integer, primary_key=True, autoincrement=True)
    question_text = Column(Text)
    question_type = Column(String)  # 'mcq' or 'true_false'
    options = Column(Text)          # JSON string
    correct_answer = Column(String)
    explanation = Column(Text)
    category = Column(String)
    language = Column(String, default="en")


class DocumentMetadata(Base):
    __tablename__ = "documents_metadata"
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    title = Column(String)
    source = Column(String)
    doc_type = Column(String)
    state = Column(String)
    topic = Column(String)
    chunk_index = Column(Integer)
    content = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)


# ─── Dependency ───────────────────────────────────────────────────────────────

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def init_db():
    Base.metadata.create_all(bind=engine)
