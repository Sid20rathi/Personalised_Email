#this file contains the function to get the user data from database


import os
import sys
from pathlib import Path

project_root = Path(__file__).parent.parent
sys.path.insert(0, str(project_root))

from dotenv import load_dotenv
from state.state_graph import Graph_state
from models.model import Users, ResumeInfo
from config.database import db_session ,engine
from datetime import datetime, timedelta
from sqlmodel import Session ,select
import httpx
load_dotenv()


def get_user_data(state:Graph_state):

    with Session(engine) as session:
        statement = select(ResumeInfo).where(ResumeInfo.user_id == state["user_id"])
        result = session.exec(statement).all()
        for resume in result:
           full_name = resume.full_name
           experience = resume.experience
           skills = resume.skills
           projects = resume.projects

       
        

        return {
            **state,
            "full_name": full_name,
            "experience": experience,   
            "skills": skills,
            "projects": projects,
        }


async def store_db(email:str,token_data:dict):

    with Session(engine)as session:
        expires_at = datetime.utcnow() + timedelta(seconds=token_data.get('expires_in', 3600))
        statement = select(Users).where(Users.email == email)
        result = session.exec(statement).first()
        if result:
            result.access_token = token_data["access_token"]
            result.refresh_token = token_data["refresh_token"]
            result.expires_at = expires_at
            session.add(result)
            session.commit()
            session.refresh(result)
            return {"message": "Tokens stored successfully","status":200}
        else:
            return {"message": "User not found","status":404}
       

async def get_valid_token(email:str):
        with Session(engine) as session:
            statement = select(Users).where(Users.email == email)
            result = session.exec(statement).first()
            if result.access_token and result.refresh_token:
                if result.expires_at - timedelta(minutes=5) < datetime.utcnow():
                    if not result.refresh_token:
                        return None
                    try:
                        new_tokens = await refresh_access_token(result.refresh_token)
                        if new_tokens:
                            updated_token = await store_db(email, new_tokens)
                            return updated_token.access_token, None
                        else:
                            return None, "Failed to refresh token. Please re-authenticate."


                    except Exception as e:
                        return None, f"Token refresh failed: {str(e)}"
                    
                   
                else:
                    return None
            
        return result.access_token, None
               
async def refresh_access_token(refresh_token: str):
    """Refresh an expired access token"""
    client_id = os.getenv("GOOGLE_CLIENT_ID")
    client_secret = os.getenv("GOOGLE_CLIENT_SECRET")
    
    async with httpx.AsyncClient() as client:
        response = await client.post(
            "https://oauth2.googleapis.com/token",
            data={
                "client_id": client_id,
                "client_secret": client_secret,
                "refresh_token": refresh_token,
                "grant_type": "refresh_token"
            }
        )
        
        if response.status_code == 200:
            return response.json()
        return None

if __name__ =="__main__":
    get_user_data(Graph_state)





