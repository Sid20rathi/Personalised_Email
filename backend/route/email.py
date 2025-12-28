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
from functions.user_data_from_db import get_valid_token
import httpx
import base64
from datetime import datetime, timedelta
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from email.mime.application import MIMEApplication
import asyncio
from fastapi.responses import JSONResponse




class content_url(BaseModel):
    joburl : HttpUrl



router1 = APIRouter()

def convert_to_html(plain_text: str) -> str:
    """Convert plain text to HTML with larger text and tighter spacing"""
    # Split the text into lines and take only the first 2 lines
    lines = plain_text.split('\n')
    
    
    html_lines = []
    for line in lines:
        if line.startswith('# '):
            html_lines.append(f'<h2>{line[2:]}</h2>')
        elif line.startswith('---'):
            html_lines.append('<hr>')
        elif line.startswith('**') and line.endswith('**'):
            html_lines.append(f'<p><strong>{line[2:-2]}</strong></p>')
        elif line.startswith('- '):
            html_lines.append(f'<li>{line[2:]}</li>')
        else:
            html_lines.append(f'<p>{line}</p>')
    
    html = ''.join(html_lines)
    # Basic wrap for list items
    if '<li>' in html and '<ul>' not in html:
        html = f"<ul>{html}</ul>".replace('</li><li>', '</li><li>')

    return f"""
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <style>
            body {{
                font-family: Arial, sans-serif;
                line-height: 1.4; /* Tighter line height */
                color: #333;
                max-width: 600px;
                margin: 0 auto;
                padding: 10px; /* Reduced outer padding */
                font-size: 20px; /* Increased font size */
            }}
            h2 {{
                font-size: 22px;
                margin-bottom: 8px;
            }}
            p {{
                margin-bottom: 10px; /* Reduced spacing between paragraphs */
                margin-top: 0;
            }}
            ul {{
                margin-bottom: 5px;
            }}
        </style>
    </head>
    <body>
        {html}
    </body>
    </html>
    """



async def download_attachment_from_url(attachment_url: str):
    """Download attachment from Vercel Blob URL"""
    async with httpx.AsyncClient() as client:
        response = await client.get(attachment_url)
        if response.status_code == 200:
            return response.content
        else:
            raise Exception(f"Failed to download attachment: {response.status_code}")



@router1.get("/")
@limiter.limit("5/minute")
def check_health(request: Request):
    return{"message": "Email Generation Agnet is working."}


@router1.post("/email")
@limiter.limit("5/minute",error_message="Rate limit exceeded. Please wait a minute.")
async def email_generation(request: Request,content_url:content_url,user_payload:dict = Depends(Authenticate_user)):
    try:
               
        state = await graph.ainvoke({'url':str(content_url.joburl),"user_id":user_payload.get("id")})

        return {"email_subject":state["email_subject"],"email_body":state["email_body"],"company_name":state["company_name"]}
         

    except Exception as e:
        raise HTTPException(
            status_code=422,
            detail=f"Error:{str(e)}"
        )




@router1.post("/send-email")
@limiter.limit("5/minute", error_message="Rate limit exceeded. Please wait a minute.")
async def send_email(request: Request, user_payload: dict = Depends(Authenticate_user)):
    try:
        data = await request.json()
        
        user_email = user_payload.get("sub")
        to_email = data.get("to")
        subject = data.get("subject")
        body = data.get("body")
        attachment_url = data.get("attachment_url")

        if not all([user_email, to_email, subject, body]):
            raise HTTPException(status_code=400, detail="Missing required fields")

        access_token, error = await get_valid_token(user_email)

        if error:
            
            return JSONResponse(
                status_code=401,
                content={"error": error, "requires_auth": True}
            )
        
        if not access_token:
            return JSONResponse(
                status_code=401,
                content={"error": "No access token available", "requires_auth": True}
            )

        # Convert body to HTML
        html_body = convert_to_html(body)
        
        if attachment_url:
            # With attachment - use mixed multipart
            message = MIMEMultipart('mixed')
            message["to"] = to_email
            message["from"] = user_email
            message["subject"] = subject
            
            # Create alternative part for HTML and plain text
            alternative_part = MIMEMultipart('alternative')
            
            # Add plain text version
            text_part = MIMEText(body, 'plain')
            alternative_part.attach(text_part)
            
            # Add HTML version
            html_part = MIMEText(html_body, 'html')
            alternative_part.attach(html_part)
            
            # Add alternative part to main message
            message.attach(alternative_part)

            try:
                attachment_content = await download_attachment_from_url(attachment_url)
                attachment = MIMEApplication(attachment_content, _subtype="pdf")
                attachment.add_header(
                    "Content-Disposition",
                    "attachment",
                    filename="resume.pdf"
                )
                message.attach(attachment)
                
            except Exception as e:
                raise HTTPException(
                    status_code=422,
                    detail=f"Error downloading attachment"
                )
                # Continue without attachment - email still has HTML content
                
        else:
            # No attachment - use alternative multipart for HTML + plain text
            message = MIMEMultipart('alternative')
            message["to"] = to_email
            message["from"] = user_email
            message["subject"] = subject
            
            # Add plain text version first (simpler clients will use this)
            text_part = MIMEText(body, 'plain')
            message.attach(text_part)
            
            # Add HTML version (better clients will use this)
            html_part = MIMEText(html_body, 'html')
            message.attach(html_part)

        raw_message = base64.urlsafe_b64encode(message.as_bytes()).decode()

        async with httpx.AsyncClient() as client:
            response = await client.post(
                "https://gmail.googleapis.com/gmail/v1/users/me/messages/send",
                headers={
                    "Authorization": f"Bearer {access_token}",
                    "Content-Type": "application/json"
                },
                json={"raw": raw_message}
            )
            
            if response.status_code == 401:
                return JSONResponse(
                    status_code=401,
                    content={"error": "Authentication failed. Please re-authenticate.", "requires_auth": True}
                )

            if response.status_code != 200:
                return JSONResponse(
                    status_code=response.status_code,
                    content={"error": "Failed to send email", "details": response.text}
                )
            
            return {
                "success": True,
                "message": "Email sent successfully!",
                "with_attachment": attachment_url is not None
            }

    except Exception as e:
       
        raise HTTPException(
            status_code=500,
            detail=f"Error: {str(e)}"
        )