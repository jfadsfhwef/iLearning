from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from ..services import llm_service

router = APIRouter()

class GradeRequest(BaseModel):
    text: str  # original content
    mode: str  # 'essay' or 'mcq'
    user_answer: str
    generated: str  # generated prompt or MCQs

@router.post("/grade")
def grade(req: GradeRequest):
    try:
        if req.mode == 'essay':
            result = llm_service.grade_essay(req.text, req.generated, req.user_answer)
        elif req.mode == 'mcq':
            result = llm_service.grade_mcqs(req.generated, req.user_answer)
        else:
            raise ValueError('Invalid mode')
        return {"result": result}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e)) 