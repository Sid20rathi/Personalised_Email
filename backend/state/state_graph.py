from typing_extensions import TypedDict
from typing import Optional ,List


class Graph_state(TypedDict):
    job_description : str
    about_company : str
    company_name :str
    url : str
    full_name : str
    experience : str
    skills : List[str]
    projects : List[str]
    email_subject :str
    email_body :str