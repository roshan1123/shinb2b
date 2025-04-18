from pydantic import BaseModel
from models.user_model import Role
from typing import Optional

class UserCreate(BaseModel):
    username: str
    password: str


class UserLogin(BaseModel):
    username: str
    password: str

