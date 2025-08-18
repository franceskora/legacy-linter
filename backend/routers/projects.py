# routers/projects.py
from fastapi import APIRouter
from schemas import projects as project_schema
from services import intelligent_service # We will create this new service file

router = APIRouter(
    prefix="/chat",
    tags=["Chat"]
)

@router.post("/")
def handle_chat_message(request: project_schema.ModernizationRequest):
    """
    Receives a user message and sends it to the intelligent orchestrator.
    """
    response = intelligent_service.handle_user_request(
        user_input=request.legacy_code,
        target_language=request.target_language
    )
    return response