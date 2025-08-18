from fastapi import APIRouter, Depends, UploadFile, File, Form
from sqlalchemy.orm import Session
from core.dependencies import get_db, get_current_user
from PIL import Image
from .user_service import gain_xp, update_user_details, get_user_by_username
from .user_schemas import UserUpdate
from .user_model import User
import shutil
import os
import json

router = APIRouter()

UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)


@router.get("/get-user-details")
def get_user_details(current_user: User = Depends(get_current_user)):
    return current_user


@router.post("/gain-xp")
def add_xp(amount: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return gain_xp(db, current_user, amount)


@router.post("/set-user-details")
async def set_user_details(user_data: str = Form(...), profile_picture: UploadFile = File(None), current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    try:
        updates_dict = json.loads(user_data)
    except json.JSONDecodeError:
        updates_dict = {}

    if profile_picture:
        img = Image.open(profile_picture.file)
        filename = f"{current_user.id}_avatar.png"
        file_path = os.path.join(UPLOAD_FOLDER, filename)
        img.save(file_path)
        updates_dict["profile_picture"] = f"/{UPLOAD_FOLDER}/{filename}"

    return update_user_details(db, current_user, updates_dict)


@router.get("/check-username")
def check_username(username: str, db: Session = Depends(get_db)):
    existing_user = get_user_by_username(db, username)
    return {"available": existing_user is None}
