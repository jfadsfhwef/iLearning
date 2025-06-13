from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import upload, generate, grade, chat

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(upload.router)
app.include_router(generate.router)
app.include_router(grade.router)
app.include_router(chat.router)

@app.get("/")
def read_root():
    return {"message": "Backend is running"}
