import os
import sys
from pathlib import Path

project_root = Path(__file__).parent.parent
sys.path.insert(0, str(project_root))

from fastapi import APIRouter , HTTPException , status ,Depends ,Request
from pydantic import BaseModel , HttpUrl
from nodes.nodes import graph
from Auth.auth import Authenticate_user
from utils.limiter import limiter


class content_url(BaseModel):
    url : HttpUrl



router1 = APIRouter()


@router1.get("/")
@limiter.limit("5/minute")
def check_health(request: Request):
    return{"message": "Email Generation Agnet is working."}


@router1.post("/email")
@limiter.limit("5/minute")
async def email_generation(request: Request,content_url:content_url,user_payload:dict = Depends(Authenticate_user)):
    try:
        state =  graph.invoke({'url':content_url.url,"user_id":user_payload.get("id")})

        return {"email_subject":state["email_subject"],"email_body":state["email_body"]}
         

    except Exception as e:
        raise HTTPException(
            status_code=422,
            detail=f"Error:{e}"
        )
   