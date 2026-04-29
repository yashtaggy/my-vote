"""Guided journey steps endpoint."""

from fastapi import APIRouter
from app.schemas import JourneyResponse, JourneyStep, ActionItem
from app.data.election_data import JOURNEY_STEPS
from app.core.cache import cache_get, cache_set

router = APIRouter()


@router.get("/journey/steps", response_model=JourneyResponse)
async def get_journey_steps():
    """Return all journey steps with caching."""
    cached = await cache_get("journey_steps")
    if cached:
        return JourneyResponse(**cached)

    steps = [
        JourneyStep(
            step_id=s["step_id"],
            title=s["title"],
            title_hi=s["title_hi"],
            description=s["description"],
            description_hi=s["description_hi"],
            actions=[ActionItem(**a) for a in s["actions"]],
            documents=s["documents"],
            official_reference=s["official_reference"],
            official_url=s["official_url"],
            icon=s["icon"],
        )
        for s in JOURNEY_STEPS
    ]
    response = JourneyResponse(steps=steps, total_steps=len(steps))

    await cache_set("journey_steps", response.dict(), ttl=3600)
    return response
