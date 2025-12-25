import os
import sys
from pathlib import Path

project_root = Path(__file__).parent.parent
sys.path.insert(0, str(project_root))

from sqlmodel import Field, SQLModel, Column
from typing import Optional
from datetime import datetime, timedelta
from sqlalchemy.dialects.postgresql import JSONB


class Users(SQLModel, table=True):
    id: Optional[int] = Field(primary_key=True, index=True)
    name: str = Field(min_length=3, max_length=255)
    email: str = Field(nullable=False, index=True)
    password: str = Field(nullable=False)
    resume_url : Optional[str] = Field(default=None)
    access_token: Optional[str] = Field(default=None)
    refresh_token: Optional[str] = Field(default=None)
    expires_at: datetime = Field(nullable=True, default=None)



class ResumeInfo(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True, index=True)
    full_name: Optional[str] = Field(default=None, index=True)
    experience: Optional[str] = Field(default=None)
    projects: Optional[list] = Field(default=None, sa_column=Column(JSONB))
    skills: Optional[list] = Field(default=None, sa_column=Column(JSONB))
    user_id: Optional[int] = Field(default=None, foreign_key="users.id")
