from typing import Optional
from pydantic import BaseModel


class UserUpdate(BaseModel):
    username: Optional[str] = None
    full_name: Optional[str] = None
    age: Optional[int] = None
    pronouns: Optional[str] = None
    gender: Optional[str] = None
    bio: Optional[str] = None
    address: Optional[str] = None
