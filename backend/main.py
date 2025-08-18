# backend/main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import auth, projects  # Import both routers
from database import engine
import models.users
import models.projects

# Create all database tables from our models
models.users.Base.metadata.create_all(bind=engine)
models.projects.Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Legacy Linter Ultimate API",
    description="The backend service for the AI-powered code modernization tool.",
    version="1.0.0",
)

origins = ["http://localhost:3000"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include both of our routers in the application
app.include_router(auth.router)
app.include_router(projects.router)

@app.get("/")
def read_root():
    return {"status": "ok", "message": "Legacy Linter Ultimate API is running."}