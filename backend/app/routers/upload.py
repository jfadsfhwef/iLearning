from fastapi import APIRouter, File, UploadFile, HTTPException
from fastapi.responses import JSONResponse
from ..services import file_service

router = APIRouter()

@router.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    try:
        content = await file.read()
        text = file_service.extract_text(file.filename, content)
        return {"text": text}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e)) 