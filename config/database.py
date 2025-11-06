import os
from sqlmodel import SQLModel, create_engine ,Session
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")

if not DATABASE_URL:
    raise ValueError("DATABASE_URL environment variable is not set.")

engine =  create_engine(DATABASE_URL,echo=True)

dblocal = sessionmaker(autocommit=False,autoflush=False,bind=engine,class_=Session)

def db_session():
    db = dblocal()
    try:
        yield db
    finally:
        db.close()
   

