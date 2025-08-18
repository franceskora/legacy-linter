# schemas/projects.py

from pydantic import BaseModel

class ProjectBase(BaseModel):
    name: str
    description: str | None = None

class ProjectCreate(ProjectBase):
    pass

class Project(ProjectBase):
    id: int
    owner_id: int

    class Config:
        from_attributes = True

class ModernizationRequest(BaseModel):
    legacy_code: str
    target_language: str