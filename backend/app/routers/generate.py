from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from ..services import llm_service

router = APIRouter()

class GenerateRequest(BaseModel):
    text: str
    mode: str  # 'essay' or 'mcq'

@router.post("/generate")
def generate_content(req: GenerateRequest):
    try:
        if req.mode == 'essay':
            result = llm_service.generate_essay_prompt(req.text)
        elif req.mode == 'mcq':
            result = llm_service.generate_mcqs(req.text)
        else:
            raise ValueError('Invalid mode')
        return {"result": result}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e)) 