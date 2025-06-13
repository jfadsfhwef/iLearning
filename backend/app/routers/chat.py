from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional
from ..services import llm_service

router = APIRouter()

class ChatRequest(BaseModel):
    text: str  # original content
    history: Optional[List[str]] = []  # chat history
    question: str

@router.post("/chat")
def chat(req: ChatRequest):
    try:
        # Validate inputs
        if not req.question or not req.question.strip():
            raise HTTPException(status_code=400, detail="Question cannot be empty")
        
        if not req.text or not req.text.strip():
            raise HTTPException(status_code=400, detail="Educational content is required")
        
        # Ensure history is a list
        history = req.history if req.history else []
        
        result = llm_service.tutoring_chat(req.text, history, req.question.strip())
        return {"result": result}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}") 