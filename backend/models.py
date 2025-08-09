from sqlalchemy import Column, Integer, String
from database import Base
from database import engine


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)

    username = Column(String, nullable=True)
    profile_picture = Column(String, nullable=True)
    full_name = Column(String, nullable=True)
    age = Column(Integer, nullable=True)
    pronouns = Column(String, nullable=True)
    gender = Column(String, nullable=True)
    bio = Column(String, nullable=True)
    address = Column(String, nullable=True)

    role = Column(String, default="user")
    xp = Column(Integer, default=0)
    level = Column(Integer, default=1)


User.metadata.create_all(bind=engine)
