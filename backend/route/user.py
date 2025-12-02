import os
import sys
from pathlib import Path

project_root = Path(__file__).parent.parent
sys.path.insert(0, str(project_root))

from fastapi import HTTPException, status , APIRouter , Depends ,Request
from fastapi.security import OAuth2PasswordBearer ,OAuth2PasswordRequestForm
from models.model import Users, ResumeInfo
from services.users.helper import create_user , find_user , sign_in
from utils.helper import verify_password ,create_access_token ,hash_password
from Auth.auth import Authenticate_user
from utils.limiter import limiter




router4 = APIRouter()


@router4.get("/health")
@limiter.limit("5/minute")
def check_health(request: Request,user_payload:dict = Depends(Authenticate_user)):
    return{"status":"healthy","user":user_payload.get("sub"),"id":user_payload.get("id")}


@router4.post("/signup")
@limiter.limit("5/minute")
def user_signup(request: Request,user:Users):
    try:
        present = find_user(user.email)
        if present:
            raise HTTPException(status_code=400, detail="User already exists")
        user.password = hash_password(user.password)
        new_user =create_user(user)
        if not new_user:
            raise HTTPException(status_code=500, detail="User creation failed")
        
        return {"message": "User created successfully","access_token": new_user.get("access_token"), "token_type": "bearer"}
    except Exception as e:
        raise HTTPException(status_code=500,  detail=f"Error:{e}")




@router4.post("/signin")
@limiter.limit("5/minute")
def user_signin(request: Request,form_data:OAuth2PasswordRequestForm = Depends()):
    try:
        user = sign_in(form_data.username, form_data.password)
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        return user
    except Exception as e:
        raise HTTPException(status_code=500,  detail=f"Error:{e}")






