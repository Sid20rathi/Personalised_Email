#this file generates the email from he context collected from the user data and url
import os
import sys
from pathlib import Path

project_root = Path(__file__).parent.parent
sys.path.insert(0, str(project_root))


from dotenv import load_dotenv
from state.state_graph import Graph_state
from models.model import Users, ResumeInfo
from config.database import db_session ,engine
from sqlmodel import Session ,select
from pydantic import BaseModel
from langchain.agents import AgentExecutor, create_react_agent
from langchain.chat_models import init_chat_model
from langchain.prompts import ChatPromptTemplate



load_dotenv()

class Email_structure(BaseModel):
    email_subject : str
    email_body : str



llm = init_chat_model("google_genai:gemini-2.5-flash", api_key=os.getenv("GOOGLE_API_KEY"))




def generate_email(state:Graph_state):

    extarct_prompt =ChatPromptTemplate.from_messages([
        ("system", f'''You the professional email generator. yopu have to generate the email subject and body from the context provided to you and the email should be in the format of a professional email.
        and the email subject should be short and to the point. the body should be under 150-200 words and the email should be like a human has written the email.
         context of the job posting:

         job_description :{state["job_description"]}
         about_company : {state["about_company"]}
         company_name : {state["company_name"]}

         context of the user :
         full_name : {state["full_name"]}
         experience : {state["experience"]}
         skills : {state["skills"]}
         projects : {state["projects"]}



        '''),
        ("human", "Query: {Query}"),
    ])


    chain = extract_prompt | llm.with_structured_output(Email_structure)
    result = chain.invoke({
        "Query": f"Generate an email for the job posting with the context provided to you. the email subject should be short and to the point. the body should be under 150-200 words and the email should be like a human has written the email."
    })
