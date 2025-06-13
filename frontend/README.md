# AI-Powered Assessment Tool Frontend

This is the React frontend for the AI-Powered Assessment Tool. It allows users to upload educational documents, generate assessments, submit answers, receive feedback, and interact with a tutoring chatbot.

## Features
- Upload PDF or TXT files
- Generate essay prompts or MCQs from content
- Submit answers and receive instant grading/feedback
- Chat with an AI tutor about the content

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the development server:
   ```bash
   npm run dev
   ```
3. The app will be available at `http://localhost:5173` by default.

## Routing
- `/` - Upload page
- `/generate` - Generate assessment
- `/assessment` - Submit answers
- `/feedback` - View feedback
- `/chat` - Tutoring chatbot

## API
The frontend expects the backend FastAPI server to be running at `http://localhost:8000`.

---

# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
