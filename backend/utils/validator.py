
import os
import sys
from pathlib import Path

project_root = Path(__file__).parent.parent
sys.path.insert(0, str(project_root))
from pydantic import BaseModel

class Signinform(BaseModel):
    email: str
    password: str