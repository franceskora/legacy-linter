# routers/auth.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
import schemas, models, security
from database import SessionLocal

router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)

# Dependency to get a DB session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/register")
def register_user(user: schemas.users.UserCreate, db: Session = Depends(get_db)):
    # Check if user already exists
    db_user = db.query(models.users.User).filter(models.users.User.email == user.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Here you would verify the reCAPTCHA key from the frontend
    # For now, we'll just print a placeholder message
    print("reCAPTCHA verification would happen here.")

    hashed_password = security.get_password_hash(user.password)
    new_user = models.users.User(email=user.email, hashed_password=hashed_password, full_name=user.full_name)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return {"message": "User registered successfully"}

# We would add a /token endpoint here for login, which would return a JWT token
# For the hackathon, we'll keep it simple and just simulate a successful login.