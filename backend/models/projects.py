# backend/models/projects.py
from sqlalchemy import Column, Integer, String, ForeignKey, JSON
from database import Base

class Project(Base):
    __tablename__ = "projects"

    id = Column(Integer, primary_key=True, index=True)
    owner_id = Column(Integer, ForeignKey("users.id"))
    
    # Store the user's initial code and the full AI response package
    user_input = Column(String)
    ai_response = Column(JSON)