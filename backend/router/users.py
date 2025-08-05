from fastapi import APIRouter, Depends, HTTPException
from models import User
from utils import get_db, SECRET_KEY, ALGORITHM, oauth2_scheme, get_user_by_email
from sqlalchemy.orm import Session
from jose import JWTError, jwt

router = APIRouter()


def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=401,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )

    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception

    user = get_user_by_email(db, email=email)
    if user is None:
        raise credentials_exception

    return user


@router.get("/get-user-details")
def get_user_details(current_user: User = Depends(get_current_user)):
    return {
        "id": current_user.id,
        "email": current_user.email,
        "username": current_user.username,
        "profile_picture": current_user.profile_picture,
        "age": current_user.age,
        "pronouns": current_user.pronouns,
        "gender": current_user.gender,
        "bio": current_user.bio,
        "address": current_user.address,
    }
