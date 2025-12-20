import os
import sys
from pathlib import Path

project_root = Path(__file__).parent.parent
sys.path.insert(0, str(project_root))
from fastapi import APIRouter , HTTPException , status ,Depends ,Request
from fastapi.responses import RedirectResponse
from pydantic import BaseModel , HttpUrl

from Auth.auth import Authenticate_user
from utils.limiter import limiter




router5 = APIRouter()


@router5.post("/google")
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



@router5.post("/callback")
@limiter.limit("5/minute",error_message="Rate limit exceeded. Please wait a minute.")
async def google_callback(request:Request,user_payload:dict = Depends(Authenticate_user)):
    try:
        client_id = os.getenv("GOOGLE_CLIENT_ID")
        client_secret = os.getenv("GOOGLE_CLIENT_SECRET")
        redirect_uri = os.getenv("GOOGLE_REDIRECT_URI")
        

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error:{str(e)}"
        )
    

