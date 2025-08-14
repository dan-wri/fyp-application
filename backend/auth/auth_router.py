from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from .auth_schemas import UserCreate, Token
from .auth_service import register_user, authenticate_user, create_user_token
from core.dependencies import get_db
from core.security import decode_token

router = APIRouter()


@router.post("/register")
def register(user: UserCreate, db: Session = Depends(get_db)):
    return register_user(db, user)


@router.post("/token", response_model=Token)
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = authenticate_user(db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=401, detail="Incorrect email or password")
    token = create_user_token(user)
    return {"access_token": token, "token_type": "bearer"}


@router.get("/verify-token/{token}")
def verify_user_token(token: str):
    payload = decode_token(token)
    if not payload:
        raise HTTPException(
            status_code=403, detail="Token is invalid or expired")
    return {"message": "Token is valid"}
