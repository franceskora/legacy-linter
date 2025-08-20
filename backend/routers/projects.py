# backend/routers/chat.py
from fastapi import APIRouter, Depends
from schemas import projects as project_schema
from services import intelligent_service
from sqlalchemy.orm import Session
from database import SessionLocal
import models

router = APIRouter(
    prefix="/chat",
    tags=["Chat"]
)

def get_db(): # the get_db dependency
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/")
def handle_chat_message(request: project_schema.ModernizationRequest, db: Session = Depends(get_db)):
    response = intelligent_service.handle_user_request(
        user_input=request.legacy_code,
        target_language=request.target_language
    )

    # If the AI call was successful, save the result to the database
    if response.get("type") == "refactor_package":
        new_history_entry = models.projects.Project(
            owner_id=1, # Hardcoded for now
            user_input=request.legacy_code,
            ai_response=response.get("content")
        )
        db.add(new_history_entry)
        db.commit()

    return response