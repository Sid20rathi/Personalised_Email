from fastapi  import FastAPI 
from fastapi.middleware.cors import CORSMiddleware
import os
from route.email import router1
from route.resume_extraction import router2
from route.clerk_webhook import router3
import uvicorn




app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router1,prefix="/api/generate",tags=["Email Generation"])

app.include_router(router2,prefix="/api/extraction",tags=["Resume Extraction"])
app.include_router(router3,prefix="/api",tags=["Clerk Webhook"])



@app.get("/")
def  health_check():
    return{"message":"Email generation agent is live"}



if __name__ =="__main__":
    uvicorn.run("main:app",host="0.0.0.0",port=8000,reload=True)