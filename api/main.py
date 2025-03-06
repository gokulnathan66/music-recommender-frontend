from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import google.generativeai as genai
import os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Add your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure Gemini API
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
genai.configure(api_key=GEMINI_API_KEY)
model = genai.GenerativeModel('gemini-pro')

class MessageRequest(BaseModel):
    message: str

@app.post("/api/chat")
async def get_music_recommendation(request: MessageRequest):
    try:
        # Create a prompt that focuses on music recommendations
        prompt = f"""
        You are a music recommendation expert. Based on the following user input, 
        provide a personalized music recommendation. Only respond with music-related 
        recommendations and keep the response friendly and concise. If the question 
        is not about music, politely remind them that you can only help with music-related queries.
        
        User Input: {request.message}
        """

        response = model.generate_content(prompt)
        
        # Check if the response is valid
        if not response.text:
            raise HTTPException(status_code=400, detail="No valid response generated")
            
        return {"response": response.text}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))