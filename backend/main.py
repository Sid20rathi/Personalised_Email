from doctest import debug
from fastapi  import FastAPI ,Depends ,Request
from fastapi.middleware.cors import CORSMiddleware
import os
from route.email import router1
from route.resume_extraction import router2
from route.user import router4
from route.o2auth import router5
from utils.limiter import limiter
from slowapi import _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded



import uvicorn




app = FastAPI(debug= False)

app.state.limiter = limiter

app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router1,prefix="/api/generate",tags=["Email Generation"])

app.include_router(router2,prefix="/api/extraction",tags=["Resume Extraction"])

app.include_router(router4,prefix="/api",tags=["User"])
app.include_router(router5,prefix='/auth',tags=["OAuth2"])



@app.get("/active")
def  health_check(request: Request):
    return{"message":"Email generation agent is active"}

   
@app.get("/")
def  health_check(request: Request):
    return{"message":"Welcome to ResumeMail"}

if __name__ =="__main__":
    uvicorn.run("main:app",host="0.0.0.0",port=8000,reload=True)