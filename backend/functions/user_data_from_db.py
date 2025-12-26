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
       

async def store_db(email:str, token_data:dict):
    with Session(engine) as session:
        expires_at = datetime.utcnow() + timedelta(seconds=token_data.get('expires_in', 3600))
        statement = select(Users).where(Users.email == email)
        result = session.exec(statement).first()
        if result:
            result.access_token = token_data.get("access_token")
            result.refresh_token = token_data.get("refresh_token", result.refresh_token)  # Keep existing refresh token if not provided
            result.expires_at = expires_at
            session.add(result)
            session.commit()
            session.refresh(result)
            return result  # Return the user object instead of dict
        else:
            raise Exception("User not found")

async def get_valid_token(email:str):
    print("entered get_valid_token function")
    with Session(engine) as session:
        statement = select(Users).where(Users.email == email)
        user = session.exec(statement).first()
        
        if not user:
            return None, "User not found"
        
        if not user.access_token or not user.refresh_token:
            return None, "Tokens not found. Please authenticate."
        
        # Check if token is expired or will expire soon (5 minutes buffer)
        current_time = datetime.utcnow()
        if user.expires_at and (user.expires_at - timedelta(minutes=5)) < current_time:
            print(f"Token needs refresh. Expires at: {user.expires_at}, Current: {current_time}")
            
            try:
                new_tokens = await refresh_access_token(user.refresh_token)
                if new_tokens:
                    print(f"New tokens received: {new_tokens.keys()}")
                    updated_user = await store_db(email, new_tokens)
                    return updated_user.access_token, None
                else:
                    return None, "Failed to refresh token. Please re-authenticate."
            except Exception as e:
                print(f"Token refresh error: {str(e)}")
                return None, f"Token refresh failed: {str(e)}"
        else:
            # Token is still valid
            print(f"Token is valid. Expires at: {user.expires_at}")
            return user.access_token, None

async def refresh_access_token(refresh_token: str):
    """Refresh an expired access token"""
    try:
        if not refresh_token:
            raise Exception("Refresh token is empty")
            
        print(f"Refreshing token with refresh_token length: {len(refresh_token) if refresh_token else 0}")
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
        print(f"response {response.status_code} ''''''''{response.json()}")
        
        if response.status_code == 200:
            data = response.json()
            # Note: Google's refresh token response doesn't include a new refresh_token
            # unless you include 'access_type=offline' and 'prompt=consent' in initial auth
            return data
        else:
            print(f"Token refresh failed: {response.status_code} - {response.text}")
            return None
    
    except Exception as e:
        print(f"Error refreshing token: {str(e)}")
        return None

if __name__ =="__main__":
    get_user_data(Graph_state)





