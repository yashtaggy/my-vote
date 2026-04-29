"""Onboarding endpoint — collects user profile and determines eligibility."""

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from datetime import datetime

from app.schemas import OnboardRequest, OnboardResponse
from app.core.database import get_db, User
from app.data.election_data import UPCOMING_ELECTIONS

router = APIRouter()


@router.post("/onboard", response_model=OnboardResponse)
async def onboard_user(payload: OnboardRequest, db: Session = Depends(get_db)):
    """Accept user details and return eligibility result."""

    eligible = payload.age >= 18
    eligibility_reason = (
        "You are eligible to vote in India (18+ years old)."
        if eligible
        else f"You are {payload.age} years old. You must be 18+ to vote in India."
    )

    if not eligible:
        eligibility_reason_hi = (
            f"आप {payload.age} वर्ष के हैं। भारत में मतदान के लिए आपकी आयु 18+ होनी चाहिए।"
        )
    else:
        eligibility_reason_hi = "आप भारत में मतदान करने के योग्य हैं (18+ वर्ष)।"

    election = UPCOMING_ELECTIONS.get(payload.state, UPCOMING_ELECTIONS["default"])

    # Persist user
    user = User(
        age=payload.age,
        state=payload.state,
        city=payload.city,
        pincode=payload.pincode,
        is_first_time_voter=payload.is_first_time_voter,
        language=payload.language,
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    return OnboardResponse(
        user_id=user.id,
        eligible=eligible,
        eligibility_reason=eligibility_reason,
        upcoming_election=election,
        message=(
            "Welcome to MyVote Journey! Let's begin your voting journey."
            if eligible
            else "Keep exploring — you can learn all about the voting process now."
        ),
        language=payload.language,
    )
