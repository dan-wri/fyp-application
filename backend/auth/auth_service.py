from datetime import timedelta
from sqlalchemy.orm import Session
from fastapi import HTTPException
from .auth_schemas import UserCreate
from user.user_model import User
from core.security import hash_password, verify_password, create_access_token
from core.config import ACCESS_TOKEN_EXPIRE_MINUTES
from user.user_service import get_user_by_email


def register_user(db: Session, user: UserCreate):
    if get_user_by_email(db, user.email):
        raise HTTPException(status_code=400, detail="Email already registered")
    hashed_pw = hash_password(user.password)
    db_user = User(email=user.email, hashed_password=hashed_pw, role="user")
    db.add(db_user)
    db.commit()
    return {"message": "User created successfully"}


def authenticate_user(db: Session, email: str, password: str):
    user = get_user_by_email(db, email)
    if not user or not verify_password(password, user.hashed_password):
        return None
    return user


def create_user_token(user: User):
    return create_access_token(
        data={"sub": user.email, "role": user.role},
        expires_delta=timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    )
