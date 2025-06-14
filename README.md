# 🎓 Interesting Project: AI-Powered Homework Platform

An interactive web application that converts educational content into assessments and provides AI-powered tutoring. Upload documents (PDF/TXT) to generate essay prompts or multiple-choice quizzes, get instant AI grading, and chat with an AI tutor.

## ✨ Features

- **📚 Document Upload**: Support for PDF and text files
  <img width="658" alt="1" src="https://github.com/user-attachments/assets/20fe681a-7813-439f-a77a-e5358f4dcc3b" />

- **🎯 Assessment Generation**: AI-powered essay prompts and 20-question MCQs
  
  <img width="775" alt="Untitled" src="https://github.com/user-attachments/assets/b57b7d3e-e483-4295-bf9d-be6d39abaec0" />

  <img width="775" alt="q" src="https://github.com/user-attachments/assets/5db977c7-e3d3-42ca-9df5-e110c0e31be4" />

- **📊 Automatic Grading**: Instant feedback and scoring using Gemini AI
  <img width="792" alt="6" src="https://github.com/user-attachments/assets/c6e7a292-5a52-494e-a63c-65b639724beb" />

- **💬 AI Tutoring**: Context-aware chatbot for follow-up questions
  <img width="525" alt="qq" src="https://github.com/user-attachments/assets/2267b5c0-fb16-4dfe-aee0-c8093c038eda" />

- **🎨 Modern UI**: Clean, responsive interface with intuitive navigation
- **🐳 Containerized**: Docker and Kubernetes ready for easy deployment

## 🏗️ Architecture

- **Backend**: FastAPI (Python) with Google Gemini AI integration
- **Frontend**: React with modern CSS styling
- **AI/LLM**: Google Gemini 2.0 Flash
- **Containerization**: Docker + Kubernetes

## 🚀 Quick Start

### Prerequisites
- Python 3.10+
- Node.js 18+
- Docker (optional)
- Kubernetes cluster (optional)

### 1. Environment Setup
```bash
# Create virtual environment
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Set up environment variables
cp env.example .env
# Edit .env file and add your Google Gemini API key
```

### 2. Backend Setup
```bash
# Install dependencies
cd backend
pip install -r requirements.txt

# Start the server
uvicorn app.main:app --reload
```
Backend will be available at `http://localhost:8000`

### 3. Frontend Setup
```bash
# Install dependencies
cd frontend
npm install

# Start development server
npm run dev
```
Frontend will be available at `http://localhost:5173`

### 4. Usage
1. Open `http://localhost:5173` in your browser
2. Upload a PDF or text file
3. Choose assessment type (Essay or MCQ)
4. Complete the assessment
5. View AI-generated feedback
6. Chat with the AI tutor

## 🐳 Docker Deployment

### Build Images
```bash
# Build backend
cd backend
docker build -t ai-assessment-backend .

# Build frontend
cd frontend
docker build -t ai-assessment-frontend .
```

### Run with Docker Compose
```bash
# Create docker-compose.yml (example)
version: '3.8'
services:
  backend:
    image: ai-assessment-backend
    ports:
      - "8000:8000"
    environment:
      - GOOGLE_API_KEY=your_gemini_api_key_here
  
  frontend:
    image: ai-assessment-frontend
    ports:
      - "3000:80"
    depends_on:
      - backend

# Run
docker-compose up
```

## ☸️ Kubernetes Deployment

### Deploy to Kubernetes
```bash
# Create secret with your API key
echo -n "your_actual_gemini_api_key" | base64
# Copy the output and replace 'your_base64_encoded_api_key' in k8s/secrets.yaml

# Apply secrets first
kubectl apply -f k8s/secrets.yaml

# Apply all other manifests
kubectl apply -f k8s/backend-deployment.yaml
kubectl apply -f k8s/frontend-deployment.yaml
kubectl apply -f k8s/ingress.yaml

# Check status
kubectl get pods
kubectl get services

# Access the application
kubectl port-forward service/frontend-service 3000:80
```

### Local Development with Minikube
```bash
# Start minikube
minikube start

# Build images in minikube
eval $(minikube docker-env)
docker build -t ai-assessment-backend ./backend
docker build -t ai-assessment-frontend ./frontend

# Deploy
kubectl apply -f k8s/

# Access via minikube
minikube service frontend-service
```

## 📁 Project Structure

```
├── backend/
│   ├── app/
│   │   ├── main.py              # FastAPI app
│   │   ├── routers/             # API endpoints
│   │   │   ├── upload.py        # File upload
│   │   │   ├── generate.py      # Assessment generation
│   │   │   ├── grade.py         # Grading
│   │   │   └── chat.py          # Tutoring chat
│   │   └── services/            # Business logic
│   │       ├── file_service.py  # File processing
│   │       └── llm_service.py   # AI integration
│   ├── requirements.txt
│   └── Dockerfile
├── frontend/
│   ├── src/
│   │   ├── App.jsx              # Main React component
│   │   └── App.css              # Styling
│   ├── package.json
│   └── Dockerfile
├── k8s/                         # Kubernetes manifests
│   ├── backend-deployment.yaml
│   ├── frontend-deployment.yaml
│   └── ingress.yaml
└── README.md
```

## 🔧 Dependencies

### Backend
- `fastapi` - Web framework
- `uvicorn` - ASGI server
- `python-multipart` - File upload support
- `pydantic` - Data validation
- `PyPDF2` - PDF text extraction
- `google-genai` - Google Gemini AI client

### Frontend
- `react` - UI framework
- `react-router-dom` - Client-side routing
- `vite` - Build tool


## 🚧 Known Limitations

- MCQ parsing relies on LLM returning valid JSON format
- File size limits not explicitly enforced
- No user authentication/session management
- Limited error recovery for API failures

## 🔑 Environment Variables

Create a `.env` file in the root directory:

```bash
# Required
GOOGLE_API_KEY=your_gemini_api_key_here

# Optional (defaults shown)
BACKEND_HOST=localhost
BACKEND_PORT=8000
FRONTEND_HOST=localhost
FRONTEND_PORT=5173
```

**⚠️ Important**: Never commit your `.env` file to Git. The actual API key is excluded via `.gitignore`.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request


---

**Built with ❤️ using FastAPI, React, and Google Gemini AI**
