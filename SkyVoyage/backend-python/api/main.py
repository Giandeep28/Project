from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import time

app = FastAPI(title="SkyVoyage AI Concierge")

# Enable CORS for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

class ChatMessage(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    message: str
    messages: Optional[List[ChatMessage]] = []

@app.get("/health")
def health_check():
    return {"status": "celestial", "timestamp": time.time()}

@app.post("/api/chatbot/message")
async def chat_endpoint(request: ChatRequest):
    user_text = request.message.lower()
    
    # NLP Engine implementation (FILE 14 will contain logic)
    # Here we simulate the logic for the response
    from chatbot.engine import process_query
    
    response_text = process_query(user_text)
    
    return {
        "success": True,
        "content": [{"text": response_text}],
        "response": response_text
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
