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
from sqlmodel import Session ,select
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


def store_db(id:int,token_data:dict):

    with Session(engine)as session:
        statement = select(Users).where(Users.id == id)
        result = session.exec(statement).first()
        if result:
            result.access_token = token_data["access_token"]
            result.refresh_token = token_data["refresh_token"]
            session.add(result)
            session.commit()
            session.refresh(result)
            return {"message": "Tokens stored successfully"}
        else:
            return {"message": "User not found"}
       
        


if __name__ =="__main__":
    get_user_data(Graph_state)





