import os
import sys
from pathlib import Path
from datetime import datetime
from langchain_community.document_loaders import PyPDFLoader
from langchain.chat_models import init_chat_model
from pydantic import BaseModel, Field
from langchain_core.prompts import ChatPromptTemplate
from pathlib import Path
from models.model import Users, ResumeInfo
from config.database import db_session ,engine
from sqlmodel import Field, Session, SQLModel, create_engine, select
import tempfile
import requests
import uuid
import httpx
from langchain_groq import ChatGroq

project_root = Path(__file__).parent.parent
sys.path.insert(0, str(project_root))

from fastapi import APIRouter, HTTPException, UploadFile, File,Depends ,Request ,Response
from Auth.auth import Authenticate_user
from utils.limiter import limiter


router2 = APIRouter()
API_KEY = os.getenv("GOOGLE_API_KEY") 



class ResumeProfile(BaseModel):
    """Structured and summarized data extracted from a user's resume."""
    full_name: str = Field(description="The candidate's full name.")
    total_experience_summary: str = Field(description="A concise summary of the candidate's total professional experience (e.g., '10+ years in Python and Next.js').")
    core_skills: list[str] = Field(description="List of all the skills mentioned in the skill section of the resume, separated into distinct list items (e.g., 'TypeScript', 'PostgreSQL', 'FastAPI').")
    most_relevant_project_summary: list[str] = Field(description="A 2-3 sentence summary of the candidate's most relevant project (like ActionNote) or a major career achievement.")
    projects: list[str] = Field(description="List of all the projects mentioned in the resume,with one line of summary for each project.(eg,'QueryMentor):A website for candidate to prepare for job interviews by providing practice questions and feedback.,'ActionNote':A note-taking app with AI-powered features for better organization and retrieval of information.')")


async def upload_file(file: UploadFile):
    try:
        blob_token = os.getenv("BLOB_READ_WRITE_TOKEN")
        if not blob_token:
            raise HTTPException(
                status_code=400,
                detail="BLOB_READ_WRITE_TOKEN is not set"
            )

        file_extension = file.filename.split('.')[-1] if '.' in file.filename else 'pdf'
        unique_filename = f"resume/{uuid.uuid4()}.{file_extension}"

  
        file_content = await file.read()

        
        blob_upload_url = f"https://blob.vercel-storage.com/{unique_filename}"
        
        headers = {
            "Authorization": f"Bearer {blob_token}",
            "Content-Type": file.content_type,
        }


        response = requests.put(blob_upload_url, data=file_content, headers=headers)
        
        
        
        if response.status_code == 200:
            result = response.json()
            return result.get('url', blob_upload_url)
        else:
            raise HTTPException(
                status_code=response.status_code,
                detail=f"Blob upload failed: {response.text}"
            )
            
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to upload the file, Error: {e}"
        )


async def extract_resume(file: UploadFile):
    try:
   
        with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as temp_file:
           
            file_content = await file.read()
            temp_file.write(file_content)
            temp_file_path = temp_file.name

        try:
      
            loader = PyPDFLoader(temp_file_path)
            documents = loader.load()
            full_text = "\n\n".join(doc.page_content for doc in documents)

            if not full_text:
               
                return None

            llm = ChatGroq(
            model="qwen/qwen3-32b",
            temperature=0,
            max_tokens=None,
            reasoning_format="parsed",
            timeout=None,
            max_retries=2,
            # other params...
        )

            system_prompt = (
                "You are an expert resume parser. Your task is to accurately extract "
                "and summarize the candidate's professional details from the provided text. "
                "The output MUST strictly conform to the provided JSON schema."
            )
            
            extraction_prompt = ChatPromptTemplate.from_messages([
                ("system", system_prompt),
                ("human", "Here is the resume text: {resume_text}"),
            ])
            
            structured_extractor = extraction_prompt | llm.with_structured_output(ResumeProfile)

           
            
            parsed_data: ResumeProfile = structured_extractor.invoke({"resume_text": full_text})
            
   
            
            return parsed_data
            
        except Exception as e:
           
            return None
            
        finally:
          
            os.unlink(temp_file_path)
            
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to extract resume, Error: {e}"
        )


def adding_resume(full_name: str, experience: str, projects: list, skills: list,user_id:int):
    """Insert/update  a new resume record into the database"""
    try:
        with Session(engine) as db:
            statement = select(ResumeInfo).where(ResumeInfo.user_id == user_id)
            results = db.exec(statement).all()
            if results:
                resume = results[0]
                resume.full_name = full_name
                resume.experience = experience
                resume.projects = projects
                resume.skills = skills
                db.add(resume)
                db.commit()
                db.refresh(resume)
                
                return resume
            else:
                resume = ResumeInfo(
                    full_name=full_name,
                    experience=experience,
                    projects=projects,
                    skills=skills,
                    user_id=user_id
                )
                db.add(resume)
                db.commit()
                db.refresh(resume)
                
                return resume
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to add/update resume, Error: {e}"
        )
   

def update_resume_url(resume_url:str, email:str):
    try:
        with Session(engine) as db:
            statement = select(Users).where(Users.email == email)
            results = db.exec(statement).first()

            if results:
                resume = results
                resume.resume_url = resume_url
                db.add(resume)
                db.commit()
                db.refresh(resume)
             
                return resume
            else:
                raise HTTPException(
                    status_code=404,
                    detail="User not found"
                )





    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to update resume URL, Error: {e}"
        )

    



@router2.post("/resume_upload")
@limiter.limit("5/minute")
async def upload_resume(request: Request,file: UploadFile = File(...),user_payload:dict = Depends(Authenticate_user)):
    """
    Upload resume to Vercel Blob and return the URL
    """
    allowed_types = ['application/pdf', 'application/msword', 
                    'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
    
    if file.content_type not in allowed_types:
        raise HTTPException(
            status_code=400, 
            detail="Only PDF and Word documents are allowed"
        )
    
    max_size = 20 * 1024 * 1024  

    file_content = await file.read()
    file_size = len(file_content)
    
    if file_size > max_size:
        raise HTTPException(
            status_code=400,
            detail="File size too large. Maximum size is 20MB"
        )
    
    try:
        
        from io import BytesIO
        file.file = BytesIO(file_content)
        
        blob_url = await upload_file(file)
        if not blob_url:
            raise HTTPException(
                status_code=500, 
                detail="Failed to upload the file"
            )
        file.file = BytesIO(file_content)
        
        resume_data  = await extract_resume(file)
     

        output =  adding_resume(
            full_name=resume_data.full_name,
            experience=resume_data.total_experience_summary,
            projects=resume_data.projects,
            skills=resume_data.core_skills,
            user_id=user_payload.get("id")
        )


        resume_output = update_resume_url(
            resume_url=blob_url,
            email=user_payload.get("sub")
        )
        

        
        
        return {
            "message": "Resume uploaded successfully",
            "blob_url": blob_url,
            "filename": file.filename,
            "uploaded_at": datetime.utcnow().isoformat()
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=500, 
            detail=f"Failed to process upload: {str(e)}"
        )


@router2.get("/view-pdf")
async def view_pdf(url: str):
    """
    Proxies the PDF file to force 'inline' display.
    """
    if not url:
        raise HTTPException(status_code=400, detail="Missing URL")

    async with httpx.AsyncClient() as client:
       
        external_response = await client.get(url)
        
        if external_response.status_code != 200:
            raise HTTPException(status_code=400, detail="Failed to fetch PDF")

   
    return Response(
        content=external_response.content,
        media_type="application/pdf",
        headers={
            "Content-Disposition": "inline; filename=resume.pdf",
            "Cache-Control": "public, max-age=3600" 
        }
    )



@router2.get("/resume")
@limiter.limit("5/minute")
def get_resume(request: Request,user_payload:dict = Depends(Authenticate_user)):
    try:
        with Session(engine) as db:
            statement = select(Users).where(Users.email == user_payload.get("sub"))
            results = db.exec(statement).first()
            if results:
                return results.resume_url
            else:
                return None
              
           
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to get resume, Error: {e}"
        )
