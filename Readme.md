# ResuMail — Full Stack Overview

A full‑stack project that helps you compose personalized emails from your resume. The repository contains both `frontend` and `backend` parts.

## Live Demo
- **URL**: https://personalised-email.vercel.app/



## Why This Exists
- Writing tailored outreach emails is time‑consuming and repetitive.
- Many applicants send generic messages that fail to highlight relevant experience.
- ResuMail streamlines the process: load your resume, craft a focused subject and body, and copy them instantly for any email client.

## What It Solves Right Now
- Provides a distraction‑free compose panel with just Subject and Body.
- One‑click copy for Subject or Body to paste into Gmail/Outlook/any client.
- Clean, high‑contrast UI with a modern background that keeps content readable.
- Simple resume flow: upload once, view it, and keep composing from the same dashboard.

## Who Can Use It
- Job seekers tailoring outreach to roles and companies.
- Students applying for internships, fellowships, or research opportunities.
- Recruiters sending personalized cold emails based on candidate resumes.

## Monorepo Layout
- `frontend/`: Next.js app (UI, compose panel, resume section, dashboard)
- `backend/`: FastAPI server (resume upload/fetch, PDF proxy)

## Tech Stack
- Frontend: Next.js, React, TypeScript, Tailwind CSS, Axios, react‑hot‑toast, @tabler/icons‑react, motion/react
- Backend: FastAPI, Python, Uvicorn, Gunicorn, SQLAlchemy, Alembic, PyJWT, Passlib, python‑dotenv

## How It Works (High‑Level)
- You sign in and land on the dashboard.
- Upload your resume (PDF); the app stores it securely.
- View the resume in the built‑in PDF viewer (proxied for safety).
- Open the compose panel, fill Subject and Body, and copy with one click.
- Paste into your email client and send. Closing the panel hides it and can clear any job URL context.

## Setup
### Frontend
- `cd frontend`
- Install deps: `npm install`
- Create `frontend/.env.local`: set `NEXT_PUBLIC_API_URL` to your backend base URL
- Start dev: `npm run dev` and open `http://localhost:3000`

### Backend
- `cd backend`
- Install deps: `pip install -r requirements_all.txt`
- Start dev: `uvicorn main:app --reload` (adjust if your server differs)

## Environment & Configuration
- Frontend: `NEXT_PUBLIC_API_URL` must point to the backend.
- Backend: allow CORS from the frontend origin; configure any storage or auth secrets as needed.

## Using the App (No Code)
- Sign in
- Go to Resume and upload your PDF
- Open Email, write a concise subject and message
- Use Copy buttons to copy subject/body
- Paste into your preferred mail client and send



## Roadmap
- Optional integrations with Gmail/Outlook APIs to send directly.
- Template management and personalization hints.
- Smart suggestions based on resume sections.
- Export/share options for drafts.



## Contributing
- Open issues for bugs or feature requests.
- Submit PRs with clear descriptions and rationale.

