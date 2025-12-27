import os
import sys
from pathlib import Path

project_root = Path(__file__).parent.parent
sys.path.insert(0, str(project_root))

from dotenv import load_dotenv
from langchain.chat_models import init_chat_model
from langchain import hub
from langchain_core.prompts import ChatPromptTemplate
from state.state_graph import Graph_state
from pydantic import BaseModel, Field 
import google.genai as genai
from google.genai.types import Tool, GenerateContentConfig
from playwright.async_api import async_playwright
from langchain_google_genai import ChatGoogleGenerativeAI
from playwright.sync_api import sync_playwright 
import asyncio
from concurrent.futures import ThreadPoolExecutor



load_dotenv()

class JobDetails(BaseModel):
    """Structured data extracted from the job posting summary."""
    job_description: str = Field(description="The detailed description of the job role and responsibilities.")
    about_company: str = Field(description="The general information about the company.")
    company_name: str = Field(description="The name of the company posting the job.")


executor = ThreadPoolExecutor(max_workers=1)








async def scrape_page_content(url: str) -> str:
    """Async function to scrape page content using Playwright"""
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        page = await browser.new_page()

        # Navigate to the page
        await page.goto(url, wait_until="domcontentloaded", timeout=60000)
        
        # Wait for content to load
        await page.wait_for_timeout(3000)

        # Get the page content
        content = await page.inner_text("body")

        # Close browser
        await browser.close()
        return content







def summarize_with_gemini(page_text: str) -> str:
    """Use Gemini to extract job descriptions + company info"""

    llm = ChatGoogleGenerativeAI(
        model="gemini-2.5-flash",
        temperature=0,
        google_api_key=os.getenv("GOOGLE_API_KEY"),
    )

  

    parser_prompt = ChatPromptTemplate.from_messages([
            ("system", "You are a recruiter assistant. Your task is to extract the required fields from the following text. From the text below: 1. provide detailed job descriptions.Summarize what the company does.3. Highlight skills, technologies, experience levels, and locations if available.and if your not able to extract any of the fields just return empty string."),
            ("human", "Text to parse: {text}"),
        ])
    
    structured_parser = parser_prompt | llm.with_structured_output(JobDetails)
    response = structured_parser.invoke({"text": page_text})
    return response



async def data_from_url(state: Graph_state):
    try:
        page_text =  await scrape_page_content(state['url'])
        result = summarize_with_gemini(page_text)
       
        return{
            **state,
            "job_description": result.job_description,
            "about_company": result.about_company,
            "company_name": result.company_name,
        }
        

    except Exception as e:
        
        return{
            **state,
            "job_description": "",
            "about_company": "",
            "company_name": "",
        }
    
 











    
