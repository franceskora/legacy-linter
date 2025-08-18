# backend/models/projects.py
from sqlalchemy import Column, Integer, String, ForeignKey
from database import Base

class Project(Base):
    __tablename__ = "projects"

    id = Column(Integer, primary_key=True, index=True)
    # We can add more details later, like the project name
    # For now, we just need to link it to a user
    owner_id = Column(Integer, ForeignKey("users.id"))