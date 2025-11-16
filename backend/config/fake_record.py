'''This is the script to add fake data to the database'''

import os
import sys
from pathlib import Path

project_root = Path(__file__).parent.parent
sys.path.insert(0, str(project_root))
from models.model import Users, ResumeInfo
from database import db_session ,engine
from sqlmodel import Session


def adding_user(name:str,email:str,password:str,):
    user = Users(name=name,email=email,password=password)
    with Session(engine) as session:
        session.add(user)
        session.commit()
        session.refresh(user)
        print("user added successfully")
        return user

def adding_resume(full_name: str, experience: str, projects: list, skills: list,user_id:int):
    """Insert a new resume record into the database"""
    with Session(engine) as db:
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
        print("✅ Resume added successfully:", resume)
        return resume
    

if __name__ == "__main__":
    adding_resume(
        full_name="Siddhant Rathi",
        experience="5 months of experience in Generative AI and web development.",
        skills=[
            'Python', 'JavaScript', 'Java', 'TypeScript', 'React.js', 'Next.js', 'HTML', 'CSS',
            'Three.js', 'GSAP', 'Streamlit', 'Node.js', 'Express.js', 'FastAPI', 'OpenAI',
            'LLaMA2', 'Gemini', 'Groq', 'LangChain', 'Hugging Face', 'TensorFlow', 'NLP',
            'Vector Embeddings', 'Neural Networks', 'MySQL', 'PostgreSQL', 'SQL', 'ChromaDB',
            'Docker', 'Kubernetes', 'GitHub CI/CD', 'AWS', 'Hugging Face Spaces', 'Kafka',
            'Redis', 'DSA', 'DBMS', 'OS', 'OOPS', 'Microservices'
        ],
        projects=[
            "QueryMentor: An AI-driven interview preparation platform utilizing Gemini AI for intelligent question generation and performance analysis.",
            "Talk2Data: A conversational AI system using LangChain and Groq's LLM to enable natural language interaction with SQL databases.",
            "Serverless Blog Generator using AWS Bedrock & Lambda: A fully serverless blog generation system using AWS Bedrock to generate SEO-optimized blog content on demand."
        ],user_id=1
    )
   
    
