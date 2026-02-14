import os
import sys
from pathlib import Path

# Add project root to path
project_root = Path(__file__).parent.parent
sys.path.insert(0, str(project_root))

from dotenv import load_dotenv
from state.state_graph import Graph_state
from models.model import Users, ResumeInfo
from config.database import db_session, engine
from sqlmodel import Session, select
from pydantic import BaseModel
from langchain.prompts import ChatPromptTemplate




load_dotenv()

class Email_structure(BaseModel):
    email_subject: str
    email_body: str

from langchain_groq import ChatGroq
llm = ChatGroq(
    model="qwen/qwen3-32b",
    temperature=0,
    max_tokens=None,
    reasoning_format="parsed",
    timeout=None,
    max_retries=2,
    # other params...
)

def generate_email(state: Graph_state):
    try:
        extract_prompt = ChatPromptTemplate.from_messages([
            ("system", f'''You are a professional email writer. You have to generate the email subject and body from the context provided to you and the email should be in the format of a professional email.
            The email subject should be short and to the point. The body should be under 200-250 words and the email should sound like a human wrote it.
            
            Context of the job posting:
            job_description: {state["job_description"]}
            about_company: {state["about_company"]}
            company_name: {state["company_name"]}

            Context of the user:
            full_name: {state["full_name"]}
            experience: {state["experience"]}
            skills: {state["skills"]}
            projects: {state["projects"]}

            Important notes: 
            1) Don't include the user name and the company name in the subject of the email.
            2) If you don't have any information about the user or the job description then you should not include that in the email. Instead, generate a generic email to apply for any job that user can use anytime.
            3) If the user projects match with the job description then include them in the email.
            4) Don't mention the total duration of experience in the email (e.g., instead of "5 months of experience", mention "I have experience in the field of web development and generative AI").
            5) Don't include words like "Thank you", etc. Keep it on point and professional.
            6) If the job description, about the company, or company name is not present or not relevant to the user then don't include it. Generate a generic email using the user info only.
            7) End the email by mentioning "Regards", then follow up with the name of the user.
            8) If the user projects and skills match with the company then mention how the user can be a good candidate for the job.
            9) Include the company name in the email. Use "Dear Sir or Madam", not "Hiring Team". 
            '''),
            ("human", "Query: {Query}"),
        ])

        # with_structured_output works great with Vertex AI as well
        chain = extract_prompt | llm.with_structured_output(Email_structure)
        
        result = chain.invoke({                         
            "Query": "Generate an email for the job posting with the context provided to you. The email subject should be short and to the point. The body should be under 200-250 words and the email should be like a human has written the email."
        })

        print("result is", result)

        return {
            **state,
            "email_subject": result.email_subject,
            "email_body": result.email_body
        }
        
    except Exception as e:
        print("Error generating email:", e)
        # It's good practice to print the full traceback for debugging on Render logs
        import traceback
        traceback.print_exc() 
        
        return {
            **state,
            "email_subject": "",
            "email_body": ""
        }

if __name__ == "__main__":
    # Mock state for testing locally
    mock_state = {
        "job_description": "Python Developer", 
        "about_company": "Tech Corp", 
        "company_name": "TechInc", 
        "full_name": "John Doe", 
        "experience": "Junior", 
        "skills": "Python", 
        "projects": "Chatbot"
    }
    generate_email(mock_state)