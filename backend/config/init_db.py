import os
import sys
from pathlib import Path

project_root = Path(__file__).parent.parent
sys.path.insert(0, str(project_root))

from database import engine
from models.model import Users,ResumeInfo 
from sqlmodel import SQLModel

def create_tables():
    '''This function creates the tables in the database.'''
    SQLModel.metadata.create_all(engine)
    

if __name__ =='__main__':
    create_tables()