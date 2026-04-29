"""Election information endpoint with caching."""

from fastapi import APIRouter, Query
from app.schemas import ElectionInfoResponse
from app.data.election_data import UPCOMING_ELECTIONS, INDIA_STATES
from app.core.cache import cache_get, cache_set

router = APIRouter()


@router.get("/election-info", response_model=ElectionInfoResponse)
async def get_election_info(state: str = Query("Delhi")):
    """Return election info for a given state."""
    cache_key = f"election_info_{state}"
    cached = await cache_get(cache_key)
    if cached:
        return ElectionInfoResponse(**cached)

    election = UPCOMING_ELECTIONS.get(state, UPCOMING_ELECTIONS["default"])

    response = ElectionInfoResponse(
        state=state,
        upcoming_elections=[election],
        important_dates={
            "Last date for voter registration": "90 days before election",
            "Model Code of Conduct begins": "On election schedule announcement",
            "Polling day": election.get("date", "TBD"),
            "Result declaration": "3-5 days after polling",
        },
        registration_deadline="90 days before election date",
        source="Election Commission of India — eci.gov.in",
    ).dict()

    await cache_set(cache_key, response, ttl=3600)
    return response
