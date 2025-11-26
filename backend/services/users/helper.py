import os
import sys
from pathlib import Path

project_root = Path(__file__).parent.parent
sys.path.insert(0, str(project_root))
from models.model import Users, ResumeInfo
from config.database import db_session ,engine
from sqlmodel import Session ,select
from pydantic import BaseModel
from dotenv import load_dotenv
from fastapi import HTTPException
from utils.helper import verify_password ,create_access_token ,hash_password
load_dotenv()



def create_user(user:Users):
      try:
        user = Users(name=user.name,email=user.email,password=user.password)
        with Session(engine) as session:
            session.add(user)
            session.commit()
            session.refresh(user)

        current = find_user(user.email)
        access_token = create_access_token({"sub": current.email,"id":current.id})
        if not current:
            raise HTTPException(status_code=500, detail="User creation failed")
        return {"message":"User created successfully","access_token": access_token, "token_type": "bearer"}
           
         
        
      except Exception as e:
        raise HTTPException(status_code=500,  detail=f"Error:{e}")


def find_user(email:str):
    try:
        with Session(engine) as session:
            statement = select(Users).where(Users.email == email)
            results = session.exec(statement)
            user = results.first()
            if user:
                return user
            else:
                return None
        

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


  

def sign_in(email:str, password:str):
    try:
        user = find_user(email)
        if not user : 
            raise HTTPException(status_code=404, detail="User not found")
        
        if not verify_password(password, user.password):
            raise HTTPException(status_code=401, detail="Incorrect password")
        
        access_token = create_access_token({"sub": user.email,"id":user.id})
        return {"access_token": access_token, "token_type": "bearer"}
        
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
        






