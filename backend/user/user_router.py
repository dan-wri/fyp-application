from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from core.dependencies import get_db, get_current_user
from .user_service import gain_xp, update_user_details, get_user_by_username
from .user_schemas import UserUpdate
from .user_model import User

router = APIRouter()


@router.get("/get-user-details")
def get_user_details(current_user: User = Depends(get_current_user)):
    return current_user


@router.post("/gain-xp")
def add_xp(amount: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return gain_xp(db, current_user, amount)


@router.post("/set-user-details")
def set_user_details(form_data: UserUpdate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return update_user_details(db, current_user, form_data)


@router.get("/check-username")
def check_username(username: str, db: Session = Depends(get_db)):
    existing_user = get_user_by_username(db, username)
    return {"available": existing_user is None}
