"""Quiz endpoint — questions and answer checking."""

from fastapi import APIRouter
from app.schemas import QuizQuestionOut, QuizAnswerRequest, QuizAnswerResponse, QuizOption, QuestionType
from app.data.election_data import QUIZ_QUESTIONS
from app.core.cache import cache_get, cache_set

router = APIRouter()


@router.get("/quiz", response_model=list[QuizQuestionOut])
async def get_quiz_questions():
    """Return all quiz questions (without answers)."""
    cached = await cache_get("quiz_questions")
    if cached:
        return cached

    questions = [
        QuizQuestionOut(
            id=q["id"],
            question=q["question"],
            question_hi=q["question_hi"],
            type=QuestionType(q["type"]),
            options=[QuizOption(**o) for o in q["options"]],
            category=q["category"],
        ).dict()
        for q in QUIZ_QUESTIONS
    ]
    await cache_set("quiz_questions", questions, ttl=3600)
    return questions


@router.post("/quiz/answer", response_model=QuizAnswerResponse)
async def check_answer(payload: QuizAnswerRequest):
    """Check quiz answer and return explanation."""
    question = next((q for q in QUIZ_QUESTIONS if q["id"] == payload.question_id), None)
    if not question:
        return QuizAnswerResponse(
            correct=False,
            correct_answer="N/A",
            explanation="Question not found.",
            explanation_hi="प्रश्न नहीं मिला।",
        )
    correct = payload.answer.strip().lower() == question["correct_answer"].lower()
    return QuizAnswerResponse(
        correct=correct,
        correct_answer=question["correct_answer"],
        explanation=question["explanation"],
        explanation_hi=question["explanation_hi"],
    )
