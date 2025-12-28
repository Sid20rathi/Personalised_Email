import os
import sys
from pathlib import Path

project_root = Path(__file__).parent.parent
sys.path.insert(0, str(project_root))
from fastapi import APIRouter , HTTPException , status ,Depends ,Request
from fastapi.responses import RedirectResponse ,JSONResponse
from pydantic import BaseModel , HttpUrl
from functions.user_data_from_db import store_db

from dotenv import load_dotenv

from models.model import Users, ResumeInfo
from config.database import db_session ,engine
from sqlmodel import Session ,select


from Auth.auth import Authenticate_user
from utils.limiter import limiter
import httpx

load_dotenv()


router5 = APIRouter()

@router5.get("/health")
def health_check():
    return {"message": "OAuth2 route is healthy"}


@router5.get("/google")
@limiter.limit("5/minute",error_message="Rate limit exceeded. Please wait a minute.")
async def google_oauth(request:Request,user_payload:dict = Depends(Authenticate_user)):
    try:
        client_id = os.getenv("GOOGLE_CLIENT_ID")
        client_secret = os.getenv("GOOGLE_CLIENT_SECRET")
        redirect_uri = os.getenv("GOOGLE_REDIRECT_URI")

        scopes = [
            "https://www.googleapis.com/auth/gmail.send",
            "https://www.googleapis.com/auth/userinfo.email"
        ]

        auth_url = (
            f"https://accounts.google.com/o/oauth2/v2/auth?"
            f"client_id={client_id}&"
            f"redirect_uri={redirect_uri}&"
            f"response_type=code&"
            f"scope={' '.join(scopes)}&"
            f"access_type=offline&"
            f"prompt=consent"
        )

        return {"auth_url": auth_url}
    
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error:{str(e)}"
        )



@router5.get("/callback")
@limiter.limit("5/minute",error_message="Rate limit exceeded. Please wait a minute.")
async def google_callback(request:Request,code:str):
    try:
        client_id = os.getenv("GOOGLE_CLIENT_ID")
        client_secret = os.getenv("GOOGLE_CLIENT_SECRET")
        redirect_uri = os.getenv("GOOGLE_REDIRECT_URI")

        async with httpx.AsyncClient() as client:
            token_response = await client.post(
                "https://oauth2.googleapis.com/token",
                data={
                    "client_id": client_id,
                    "client_secret": client_secret,
                    "redirect_uri": redirect_uri,
                    "grant_type": "authorization_code",
                    "code": code,
                },
            )
            if token_response.status_code != 200:
                return JSONResponse(
                    status_code=400,
                    content={"error": "Failed to exchange code", "details": token_response.text}
                )

            token_data = token_response.json()

            user_info_response = await client.get(
                "https://www.googleapis.com/oauth2/v2/userinfo",
                headers={"Authorization": f"Bearer {token_data['access_token']}"}
            )


            user_email = user_info_response.json()["email"]
            




            db_response = await store_db(user_email,token_data)

            if db_response["status"] == 404:
                return JSONResponse(
                    status_code=db_response["status"],
                    content={"error": db_response["message"],"message":"Please verify with the signed up email."},
                    
                )
            



            return RedirectResponse(
                url=f"https://www.resumail.online/dashboard?auth=success"
                

            )


            
            
        

    except Exception as e:
        
        return RedirectResponse(url="https://www.resumail.online/dashboard?auth=failed")
        
    
@router5.get("/authenticate")
@limiter.limit("5/minute",error_message="Rate limit exceeded. Please wait a minute.")
async def check_authenticated(request:Request,user_payload:dict = Depends(Authenticate_user)):
    try:
        with Session(engine) as session:
            statement = select(Users).where(Users.id == user_payload["id"])
            result = session.exec(statement).first()
            if result.access_token:
                return {"authenticated": True}
            else:
                return {"authenticated": False}
        
      
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error:{str(e)}"
        )
      


@router5.get("/refresh")
@limiter.limit("5/minute",error_message="Rate limit exceeded. Please wait a minute.")
async def refresh_token(request:Request,user_payload:dict = Depends(Authenticate_user)):
    try:
        with Session(engine) as session:
            statement = select(Users).where(Users.id == user_payload["id"])
            result = session.exec(statement).first()
            if result.access_token:
                result.access_token = None
                session.add(result)
                session.commit()
                session.refresh(result)
                return {"authenticated": False}
            else:
                return {"authenticated": False}
        
      
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error:{str(e)}"
        )
      