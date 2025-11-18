import os
import sys
from pathlib import Path

project_root = Path(__file__).parent.parent
sys.path.insert(0, str(project_root))

from fastapi import APIRouter, HTTPException, Depends, Request
from models.model import Users
from config.database import db_session
from sqlmodel import Session, select
from dotenv import load_dotenv

from svix.webhooks import Webhook, WebhookVerificationError

load_dotenv()

router3 = APIRouter()

# MUST BE the value shown in Clerk Webhook Settings (starts with whsec_)
WEBHOOK_SECRET = os.getenv("CLERK_WEBHOOK_SECRET")


@router3.get("/check-health")
def check_health():
    return {"message": "Clerk Webhook is running."}


@router3.post("/clerk-webhook", response_model=None)
async def user_webhook(request: Request, db: Session = Depends(db_session)):
    """Webhook to sync Clerk users to database."""

    body = await request.body()

    webhook = Webhook(WEBHOOK_SECRET)


    try:
        event = webhook.verify(body, request.headers)
    except WebhookVerificationError:
        raise HTTPException(status_code=400, detail="Invalid Clerk webhook signature")


    event_type = event["type"]
    data = event["data"]

    clerk_id = data["id"]

    email = (
        data["email_addresses"][0]["email_address"]
        if data.get("email_addresses")
        else None
    )

    first_name = data.get("first_name") or ""
    last_name = data.get("last_name") or ""
    full_name = f"{first_name} {last_name}".strip()
    password = data.get("password") 


    stmt = select(Users).where(Users.clerk_id == clerk_id)
    user = db.exec(stmt).first()

    if event_type == "user.created" and not user:
        new_user = Users(clerk_id=clerk_id, email=email or "sid@example.com", password=password,name=full_name)
        db.add(new_user)
        db.commit()
        db.refresh(new_user)
        return {"status": "user_created"}

    if event_type == "user.updated" and user:
        user.email = email
        user.name = full_name
        db.add(user)
        db.commit()
        return {"status": "user_updated"}

    return {"status": "ignored_event"}
