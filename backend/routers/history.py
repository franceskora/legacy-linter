# backend/routers/history.py
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import SessionLocal
import models

router = APIRouter(
    prefix="/history",
    tags=["History"]
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/")
def get_history_for_user(db: Session = Depends(get_db)):
    # In a real app, we'd filter by a logged-in user's ID
    # For the hackathon, we'll just return all projects
    history = db.query(models.projects.Project).all()
    return history