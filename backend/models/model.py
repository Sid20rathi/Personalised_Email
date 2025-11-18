import os
import sys
from pathlib import Path

project_root = Path(__file__).parent.parent
sys.path.insert(0, str(project_root))

from sqlmodel import Field, SQLModel, Column
from typing import Optional
from sqlalchemy.dialects.postgresql import JSONB


class Users(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True, index=True)
    clerk_id: str = Field(nullable=False, index=True,unique=True)
    name: str = Field(min_length=3, max_length=255)
    email: str = Field(nullable=False, index=True)
    password: str = Field(nullable=False)
    resume_url : Optional[str] = Field(default=None)


class ResumeInfo(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True, index=True)
    full_name: Optional[str] = Field(default=None, index=True)
    experience: Optional[str] = Field(default=None)
    projects: Optional[list] = Field(default=None, sa_column=Column(JSONB))
    skills: Optional[list] = Field(default=None, sa_column=Column(JSONB))
    clerk_id: Optional[str] = Field(default=None, foreign_key="users.clerk_id")
