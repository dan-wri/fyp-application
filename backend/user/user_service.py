from sqlalchemy.orm import Session
from .user_model import User
from .user_schemas import UserUpdate


def get_user_by_email(db: Session, email: str):
    return db.query(User).filter(User.email == email).first()


def get_user_by_username(db: Session, username: str):
    return db.query(User).filter(User.username == username).first()


def gain_xp(db: Session, user: User, amount: int):
    user.xp += amount
    while user.xp >= 5000:
        user.xp -= 5000
        user.level += 1
    db.commit()
    return {"xp": user.xp, "level": user.level}


def update_user_details(db: Session, user: User, updates: dict):
    for field, value in updates.items():
        if value is not None:
            setattr(user, field, value)
    db.commit()
    db.refresh(user)
    return user
