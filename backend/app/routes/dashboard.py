"""Dashboard endpoint — progress tracker and eligibility summary."""

from fastapi import APIRouter, Query
from app.schemas import DashboardResponse, ProgressStep
from app.data.election_data import UPCOMING_ELECTIONS

router = APIRouter()

STEPS_META = [
    {"step_id": 1, "name": "Eligibility Check",       "name_hi": "पात्रता जांच",         "description": "Confirm age & citizenship"},
    {"step_id": 2, "name": "Voter Registration",       "name_hi": "मतदाता पंजीकरण",       "description": "Fill Form 6 on NVSP portal"},
    {"step_id": 3, "name": "Verification",             "name_hi": "सत्यापन",               "description": "Track application & get EPIC"},
    {"step_id": 4, "name": "Polling Day Preparation",  "name_hi": "मतदान दिवस की तैयारी", "description": "Find booth & carry ID"},
    {"step_id": 5, "name": "Cast Your Vote",           "name_hi": "मत डालें",             "description": "Vote on EVM"},
]


@router.get("/dashboard", response_model=DashboardResponse)
async def get_dashboard(
    user_id: str = Query(...),
    state: str = Query("Delhi"),
    completed_steps: str = Query("1"),  # comma-separated step ids
):
    """Return dashboard data for a user."""
    completed_ids = set(int(x) for x in completed_steps.split(",") if x.strip().isdigit())
    election = UPCOMING_ELECTIONS.get(state, UPCOMING_ELECTIONS["default"])

    steps = [
        ProgressStep(
            step_id=s["step_id"],
            name=s["name"],
            name_hi=s["name_hi"],
            description=s["description"],
            completed=s["step_id"] in completed_ids,
        )
        for s in STEPS_META
    ]

    completion_pct = (len(completed_ids) / len(STEPS_META)) * 100

    return DashboardResponse(
        user_id=user_id,
        eligible=True,
        state=state,
        upcoming_election=election,
        progress=steps,
        completion_percentage=round(completion_pct, 1),
    )
