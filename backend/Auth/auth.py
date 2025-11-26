import os
import sys
from pathlib import Path

project_root = Path(__file__).parent.parent
sys.path.insert(0, str(project_root))

from fastapi import HTTPException ,status, Depends ,Request
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from utils.helper import verify_token



from dotenv import load_dotenv
load_dotenv()


oauth2_scheme = OAuth2PasswordBearer(tokenUrl="signin")


async def Authenticate_user(token:str = Depends(oauth2_scheme)):

    try:
        payload = verify_token(token)
        return payload
    except HTTPException as e:
        raise HTTPException(status_code=e.status_code, detail=e.detail)



