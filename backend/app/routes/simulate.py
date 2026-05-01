"""
Deterministic simulation engine for the voting process.
Rule-based, no LLM involvement — ensures reliable, exact flows.
"""

from fastapi import APIRouter
from app.schemas import SimulateRequest, SimulateResponse, SimulationAction
from app.services.analytics import bq_analytics

router = APIRouter()

# Mock candidates for simulation
MOCK_CANDIDATES = [
    {"id": 1, "name": "Priya Sharma",    "party": "National Progress Party",  "symbol": "🌿"},
    {"id": 2, "name": "Rajesh Kumar",    "party": "People's Democratic Front", "symbol": "⭐"},
    {"id": 3, "name": "Anita Desai",     "party": "Lok Shakti Party",          "symbol": "🌸"},
    {"id": 4, "name": "Mohammed Iqbal",  "party": "United Development Party",  "symbol": "🔔"},
    {"id": 5, "name": "NOTA",            "party": "None Of The Above",         "symbol": "✖️"},
]

SIMULATION_FLOW = {
    SimulationAction.ENTER_BOOTH: {
        "next": SimulationAction.SHOW_ID,
        "message": "Welcome to the polling booth! Please show your photo ID to the polling officer.",
        "message_hi": "मतदान केंद्र में आपका स्वागत है! कृपया मतदान अधिकारी को अपना फोटो पहचान पत्र दिखाएं।",
    },
    SimulationAction.SHOW_ID: {
        "next": SimulationAction.SIGN_REGISTER,
        "message": "ID verified! Please sign the electoral register (or give left thumb impression).",
        "message_hi": "पहचान पत्र सत्यापित! कृपया मतदाता रजिस्टर पर हस्ताक्षर करें (या बाएं अंगूठे का निशान दें)।",
    },
    SimulationAction.SIGN_REGISTER: {
        "next": SimulationAction.RECEIVE_SLIP,
        "message": "Signed! The polling officer will apply indelible ink on your left index finger.",
        "message_hi": "हस्ताक्षर हो गए! मतदान अधिकारी आपकी बाईं तर्जनी पर अमिट स्याही लगाएगा।",
    },
    SimulationAction.RECEIVE_SLIP: {
        "next": SimulationAction.PRESS_EVM,
        "message": "Ink applied! You may now proceed to the EVM. Choose your candidate and press the button.",
        "message_hi": "स्याही लग गई! अब आप EVM की ओर जा सकते हैं। अपना उम्मीदवार चुनें और बटन दबाएं।",
        "show_evm": True,
    },
    SimulationAction.PRESS_EVM: {
        "next": SimulationAction.COMPLETE,
        "message": "🗳️ Vote cast successfully! VVPAT shows your choice for 7 seconds. Thank you for voting!",
        "message_hi": "🗳️ वोट सफलतापूर्वक डाला गया! VVPAT 7 सेकंड के लिए आपकी पसंद दिखाता है। मतदान के लिए धन्यवाद!",
    },
    SimulationAction.COMPLETE: {
        "next": None,
        "message": "You have successfully completed the voting simulation! 🎉",
        "message_hi": "आपने सफलतापूर्वक मतदान सिमुलेशन पूरा कर लिया है! 🎉",
        "completed": True,
    },
}

ERROR_SCENARIOS = {
    "no_id": {
        "message": "❌ Error: No valid photo ID presented. You cannot vote without a valid ID. Please carry your Voter ID, Aadhaar, Passport, Driving Licence, or PAN Card.",
        "message_hi": "❌ त्रुटि: कोई वैध फोटो पहचान पत्र प्रस्तुत नहीं किया। कृपया मतदाता पहचान पत्र, आधार, पासपोर्ट, ड्राइविंग लाइसेंस या PAN कार्ड लाएं।",
    },
    "name_not_found": {
        "message": "❌ Error: Your name was not found in the electoral roll for this constituency. Please check your registration at electoralsearch.eci.gov.in.",
        "message_hi": "❌ त्रुटि: इस निर्वाचन क्षेत्र की मतदाता सूची में आपका नाम नहीं मिला। कृपया electoralsearch.eci.gov.in पर अपना पंजीकरण जांचें।",
    },
}


@router.post("/simulate", response_model=SimulateResponse)
async def simulate_vote(payload: SimulateRequest):
    """
    Deterministic simulation engine.
    Handles action flow and error scenarios.
    """
    # Log event to BigQuery
    bq_analytics.log_simulation_event(session_id=payload.session_id, action=payload.action)

    # Error scenario: no voter_id on SHOW_ID step
    if payload.action == SimulationAction.SHOW_ID and not payload.voter_id:
        err = ERROR_SCENARIOS["no_id"]
        return SimulateResponse(
            session_id=payload.session_id,
            success=False,
            current_step="show_id",
            next_step="show_id",
            message=err["message"],
            message_hi=err["message_hi"],
            show_evm=False,
            error="no_id",
        )

    step_data = SIMULATION_FLOW.get(payload.action)
    if not step_data:
        return SimulateResponse(
            session_id=payload.session_id,
            success=False,
            current_step="unknown",
            next_step=None,
            message="Unknown simulation step.",
            message_hi="अज्ञात चरण।",
            show_evm=False,
        )

    show_evm = step_data.get("show_evm", False)
    completed = step_data.get("completed", False)
    next_step = step_data["next"].value if step_data["next"] else None

    return SimulateResponse(
        session_id=payload.session_id,
        success=True,
        current_step=payload.action.value,
        next_step=next_step,
        message=step_data["message"],
        message_hi=step_data["message_hi"],
        show_evm=show_evm,
        candidates=MOCK_CANDIDATES if show_evm else None,
        completed=completed,
    )
