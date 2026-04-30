"""Pydantic schemas for all MyVote Journey API endpoints."""

from pydantic import BaseModel, Field, validator
from typing import List, Optional, Dict, Any
from enum import Enum


# ─── Enums ────────────────────────────────────────────────────────────────────

class Language(str, Enum):
    EN = "en"
    HI = "hi"

class QuestionType(str, Enum):
    MCQ = "mcq"
    TRUE_FALSE = "true_false"

class SimulationAction(str, Enum):
    ENTER_BOOTH = "enter_booth"
    SHOW_ID = "show_id"
    SIGN_REGISTER = "sign_register"
    RECEIVE_SLIP = "receive_slip"
    PRESS_EVM = "press_evm"
    COMPLETE = "complete"


# ─── Onboarding ───────────────────────────────────────────────────────────────

class OnboardRequest(BaseModel):
    age: int = Field(..., ge=1, le=120, description="User age")
    state: str = Field(..., min_length=2, max_length=50)
    city: str = Field(..., min_length=2, max_length=100)
    pincode: str = Field(..., pattern=r"^\d{6}$")
    is_first_time_voter: bool = True
    language: Language = Language.EN

class OnboardResponse(BaseModel):
    user_id: str
    eligible: bool
    eligibility_reason: str
    upcoming_election: Optional[Dict[str, Any]]
    message: str
    language: str


# ─── Dashboard ────────────────────────────────────────────────────────────────

class ProgressStep(BaseModel):
    step_id: int
    name: str
    name_hi: str
    completed: bool
    description: str

class DashboardResponse(BaseModel):
    user_id: str
    eligible: bool
    state: str
    upcoming_election: Optional[Dict[str, Any]]
    progress: List[ProgressStep]
    completion_percentage: float


# ─── Journey ──────────────────────────────────────────────────────────────────

class ActionItem(BaseModel):
    action: str
    action_hi: str

class JourneyStep(BaseModel):
    step_id: int
    title: str
    title_hi: str
    description: str
    description_hi: str
    actions: List[ActionItem]
    documents: List[str]
    official_reference: str
    official_url: str
    icon: str

class JourneyResponse(BaseModel):
    steps: List[JourneyStep]
    total_steps: int


# ─── Quiz ─────────────────────────────────────────────────────────────────────

class QuizOption(BaseModel):
    id: str
    text: str
    text_hi: str

class QuizQuestionOut(BaseModel):
    id: int
    question: str
    question_hi: str
    type: QuestionType
    options: List[QuizOption]
    category: str

class QuizAnswerRequest(BaseModel):
    question_id: int
    answer: str

class QuizAnswerResponse(BaseModel):
    correct: bool
    correct_answer: str
    explanation: str
    explanation_hi: str


# ─── Chat ─────────────────────────────────────────────────────────────────────

class ChatRequest(BaseModel):
    user_id: Optional[str] = None
    message: str = Field(..., min_length=1, max_length=1000)
    language: Language = Language.EN
    state: Optional[str] = None

class SourceDoc(BaseModel):
    title: str
    source: str
    url: str

class ChatResponse(BaseModel):
    answer: str
    steps: List[str]
    documents_required: List[str]
    timeline: Optional[str]
    sources: List[SourceDoc]
    disclaimer: str


# ─── Simulation ──────────────────────────────────────────────────────────────

class SimulateRequest(BaseModel):
    session_id: str
    action: SimulationAction
    voter_id: Optional[str] = None
    candidate_choice: Optional[int] = None

class SimulateResponse(BaseModel):
    session_id: str
    success: bool
    current_step: str
    next_step: Optional[str]
    message: str
    message_hi: str
    show_evm: bool = False
    candidates: Optional[List[Dict[str, Any]]] = None
    completed: bool = False
    error: Optional[str] = None


# ─── Election Info ───────────────────────────────────────────────────────────

class ElectionInfoResponse(BaseModel):
    state: str
    upcoming_elections: List[Dict[str, Any]]
    important_dates: Dict[str, str]
    registration_deadline: Optional[str]
    source: str
