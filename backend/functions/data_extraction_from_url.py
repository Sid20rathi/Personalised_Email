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


load_dotenv()

class JobDetails(BaseModel):
    """Structured data extracted from the job posting summary."""
    job_description: str = Field(description="The detailed description of the job role and responsibilities.")
    about_company: str = Field(description="The general information about the company.")
    company_name: str = Field(description="The name of the company posting the job.")

client = genai.Client()
model_id = "gemini-2.5-flash"
tools = [
  {"url_context": {}},
]


llm = init_chat_model("google_genai:gemini-2.5-flash", api_key=os.getenv("GOOGLE_API_KEY"))
prompt = hub.pull("hwchase17/react")
parser_prompt = hub.pull("hwchase17/react")



def data_from_url(state: Graph_state):
    urls="https://www.linkedin.com/jobs/view/4321067049/?alternateChannel=search&eBP=CwEAAAGbB25h74f2z43WrVj20EnnCa7cwEHh5t2NmIuE--nFIfNsHb2DvYkRW1g2xw-8I__IH9npVXW_kqxGd9iP34KKUCBEqQWodzKVdNiL_8dTCqJHn11QVUFCAPwdrwz9OZeoOiAht0MsMuKcumnjwCZfDZP8mDntrmc6yl3EtsqUvZpzJcVcGp1ToWR_00xT7B6TyDS1cV-XZ6xD06ECkfxDNQHpEnC8Sh7jLcc-b5E_F8l-CBtzf9ZpGB2G-9IYtL-io-Phji0USEu7eoTZAljqtjj8uEba3QhI805c9nBFx-4SLW2IOS8LxhTTHgs5xi5CW4ZiCzn7ddvdORuF-HCA-4gqFowLud7LjAdjdxGeg4KBzZX77Wed3Sa68qliYA11HC9l4KNN6ATY2gLnkYuUUO0bl4HlhB28zTB7eN8fjoGQgfe_pJqVN47P8UfqXMP7TRgJC6OmF7bBfMzJFLi16af1dhPJaurzWgW9AA&refId=EFlA7FEE1gEPN2bRprigxQ%3D%3D&trackingId=B%2BQmP1b2MiqhRypV56hUag%3D%3D"


    #url = state["url"]
    
    
   

    try:
      
       
        response = client.models.generate_content(
            model=model_id,
            contents=f'''from the provided url {urls},please provide me the  job_description ,about_company ,company_name in detail.
            if there is no job description available then please provide me the about_company and company_name in detail.and if company name , about company and job description are not available then return None for the missing fields''',
            config=GenerateContentConfig(
                tools=tools,
            )
        )

        agent_output = response.text
 


        parser_prompt = ChatPromptTemplate.from_messages([
            ("system", "You are a data extraction bot. Extract the required fields from the following text."),
            ("human", "Text to parse: {text}"),
        ])

        
        structured_parser = parser_prompt | llm.with_structured_output(JobDetails)
        parsed_data = structured_parser.invoke({"text": agent_output})

        print(parsed_data)

        

    except Exception as e:
        print("Error:",e)
    
 




if __name__ == "__main__":
    data_from_url(Graph_state())






    
