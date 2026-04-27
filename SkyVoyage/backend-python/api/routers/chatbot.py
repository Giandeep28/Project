from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import httpx
import os
from typing import List

router = APIRouter(prefix="/api/chat", tags=["chatbot"])

class Message(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    messages: List[Message]
    user_context: dict = {}

SYSTEM_PROMPT = """You are SkyAI, the intelligent concierge for SkyVoyage — a premium flight booking platform. You are knowledgeable about:
- Flights: search, booking, seat selection, check-in, boarding passes
- Airports: terminals, lounges, services, transit procedures
- Airlines: policies, baggage rules, meal options, loyalty programs  
- Travel: visa requirements, customs, currency, weather at destinations
- SkyVoyage platform: how to book, cancel, modify, track flights, pre-order food at stopovers

You are helpful, concise, and professional. If the user shares their booking context, use it to personalize your answers. Always respond in the same language the user writes in. For visa/medical/legal questions, always add a disclaimer to verify with official sources."""

@router.post("/message")
async def chat_message(request: ChatRequest):
    anthropic_key = os.getenv("ANTHROPIC_API_KEY")
    openai_key = os.getenv("OPENAI_API_KEY")
    
    context_str = ""
    if request.user_context:
        context_str = f"\n\nUser Context:\n{request.user_context}"
        
    if anthropic_key:
        try:
            formatted_messages = [{"role": msg.role, "content": msg.content} for msg in request.messages]
                
            async with httpx.AsyncClient(timeout=30.0) as client:
                response = await client.post(
                    "https://api.anthropic.com/v1/messages",
                    headers={
                        "x-api-key": anthropic_key,
                        "anthropic-version": "2023-06-01",
                        "content-type": "application/json"
                    },
                    json={
                        "model": "claude-3-5-haiku-20241022",
                        "max_tokens": 500,
                        "system": SYSTEM_PROMPT + context_str,
                        "messages": formatted_messages
                    }
                )
                response.raise_for_status()
                data = response.json()
                return {"reply": data["content"][0]["text"], "model": "claude"}
        except Exception as e:
            print("Anthropic API Error:", e)
            return {"reply": "I'm sorry, I am currently experiencing turbulence and couldn't process your request.", "model": "error"}
            
    elif openai_key:
        try:
            formatted_messages = [{"role": "system", "content": SYSTEM_PROMPT + context_str}]
            for msg in request.messages:
                formatted_messages.append({"role": msg.role, "content": msg.content})
                
            async with httpx.AsyncClient(timeout=30.0) as client:
                response = await client.post(
                    "https://api.openai.com/v1/chat/completions",
                    headers={
                        "Authorization": f"Bearer {openai_key}",
                        "Content-Type": "application/json"
                    },
                    json={
                        "model": "gpt-4o-mini",
                        "max_tokens": 500,
                        "messages": formatted_messages
                    }
                )
                response.raise_for_status()
                data = response.json()
                return {"reply": data["choices"][0]["message"]["content"], "model": "openai"}
        except Exception as e:
            print("OpenAI API Error:", e)
            return {"reply": "I'm sorry, I am currently experiencing turbulence and couldn't process your request.", "model": "error"}
            
    else:
        return {
            "reply": "I am offline right now. No AI keys are configured on the backend.",
            "model": "offline"
        }

@router.get("/health")
async def health_check():
    if os.getenv("ANTHROPIC_API_KEY"):
        return {"status": "ok", "model": "claude"}
    elif os.getenv("OPENAI_API_KEY"):
        return {"status": "ok", "model": "openai"}
    else:
        return {"status": "degraded", "model": "none"}
