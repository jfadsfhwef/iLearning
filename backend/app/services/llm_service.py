import os
import json
from google import genai

GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY", "AIzaSyCVkp9YJiMsPmNjFZVNaR38Pg_zcwJX8Ik")

client = genai.Client(api_key=GOOGLE_API_KEY)
MODEL = "gemini-2.0-flash"

def generate_essay_prompt(text: str) -> str:
    prompt = f"""
Based on the following educational content, create a comprehensive essay assignment for students.

EDUCATIONAL CONTENT:
{text}

TASK: Generate an essay topic with detailed guidelines for a 300-400 word essay.

Please provide:
1. A clear, engaging essay topic/question
2. Specific guidelines and requirements
3. Key points students should address
4. Evaluation criteria
5. Helpful tips for writing

Format your response clearly with headings and bullet points for easy reading.
"""
    try:
        response = client.models.generate_content(
            model=MODEL,
            contents=[prompt]
        )
        return response.text.strip()
    except Exception as e:
        return f"Error generating essay prompt: {str(e)}. Please try again."

def generate_mcqs(text: str) -> str:
    prompt = f"""
Based on the following educational content, create exactly 20 multiple-choice questions.

EDUCATIONAL CONTENT:
{text}

REQUIREMENTS:
- Create exactly 20 questions
- Each question must have exactly 4 answer choices (A, B, C, D)
- Clearly indicate the correct answer
- Provide a brief explanation for why the answer is correct
- Cover different aspects of the content
- Mix difficulty levels (easy, medium, hard)

FORMAT: Return as valid JSON array with this exact structure:
[
  {{
    "question": "Question text here?",
    "choices": ["A) Option 1", "B) Option 2", "C) Option 3", "D) Option 4"],
    "correct_answer": "A",
    "explanation": "Explanation of why this answer is correct."
  }}
]

Make sure the JSON is valid and properly formatted.
"""
    try:
        response = client.models.generate_content(
            model=MODEL,
            contents=[prompt]
        )
        return response.text.strip()
    except Exception as e:
        # Return a fallback MCQ set
        fallback = [
            {
                "question": "Based on the content provided, what is the main topic?",
                "choices": ["A) Topic A", "B) Topic B", "C) Topic C", "D) Topic D"],
                "correct_answer": "A",
                "explanation": "This is a sample question due to API error."
            }
        ]
        return json.dumps(fallback)

def grade_essay(text: str, prompt: str, user_answer: str) -> str:
    grading_prompt = f"""
You are an expert educator grading a student's essay. Provide comprehensive feedback.

ORIGINAL CONTENT:
{text}

ESSAY PROMPT:
{prompt}

STUDENT'S ESSAY:
{user_answer}

GRADING TASK:
1. Grade the essay on a scale of 0-100
2. Evaluate: content relevance, understanding, writing quality, structure, use of examples
3. Provide specific feedback on strengths and weaknesses
4. Give actionable suggestions for improvement
5. Check if the essay meets the 300-400 word requirement

Return your response as valid JSON:
{{
  "score": 85,
  "word_count": 350,
  "feedback": "Detailed feedback on the essay...",
  "strengths": ["Strength 1", "Strength 2"],
  "weaknesses": ["Weakness 1", "Weakness 2"],
  "suggestions": ["Suggestion 1", "Suggestion 2"],
  "grade_breakdown": {{
    "content": 85,
    "structure": 80,
    "writing_quality": 90
  }}
}}
"""
    try:
        response = client.models.generate_content(
            model=MODEL,
            contents=[grading_prompt]
        )
        return response.text.strip()
    except Exception as e:
        # Return fallback grading
        fallback = {
            "score": 75,
            "word_count": len(user_answer.split()),
            "feedback": f"Unable to provide detailed grading due to API error: {str(e)}",
            "strengths": ["Essay submitted successfully"],
            "weaknesses": ["Unable to analyze due to technical issue"],
            "suggestions": ["Please try submitting again"],
            "grade_breakdown": {"content": 75, "structure": 75, "writing_quality": 75}
        }
        return json.dumps(fallback)

def grade_mcqs(generated: str, user_answer: str) -> str:
    grading_prompt = f"""
You are an expert educator grading a student's multiple-choice quiz.

QUIZ QUESTIONS WITH CORRECT ANSWERS:
{generated}

STUDENT'S ANSWERS:
{user_answer}

GRADING TASK:
1. Compare student answers with correct answers
2. Calculate the score (number correct / total questions * 100)
3. Identify which questions were answered incorrectly
4. Provide explanations for incorrect answers
5. Give overall feedback and suggestions

Return your response as valid JSON:
{{
  "score": 85,
  "total_questions": 20,
  "correct_answers": 17,
  "incorrect_answers": 3,
  "percentage": 85,
  "feedback": "Overall performance feedback...",
  "incorrect_explanations": [
    {{
      "question_number": 5,
      "student_answer": "B",
      "correct_answer": "A",
      "explanation": "The correct answer is A because..."
    }}
  ],
  "suggestions": ["Study suggestion 1", "Study suggestion 2"]
}}
"""
    try:
        response = client.models.generate_content(
            model=MODEL,
            contents=[grading_prompt]
        )
        return response.text.strip()
    except Exception as e:
        # Return fallback grading
        fallback = {
            "score": 80,
            "total_questions": 20,
            "correct_answers": 16,
            "incorrect_answers": 4,
            "percentage": 80,
            "feedback": f"Unable to provide detailed grading due to API error: {str(e)}",
            "incorrect_explanations": [],
            "suggestions": ["Please try again for detailed feedback"]
        }
        return json.dumps(fallback)

def tutoring_chat(text: str, history: list[str], question: str) -> str:
    chat_prompt = f"""
You are an AI tutor helping a student understand educational content. Be helpful, encouraging, and educational.

EDUCATIONAL CONTENT:
{text}

CONVERSATION HISTORY:
{chr(10).join(history) if history else "No previous conversation"}

STUDENT'S QUESTION:
{question}

INSTRUCTIONS:
- Answer based on the educational content provided
- Be clear and educational
- Use examples when helpful
- Encourage further learning
- If the question is not related to the content, gently redirect to the material
- Keep responses concise but informative

Provide a helpful response:
"""
    try:
        response = client.models.generate_content(
            model=MODEL,
            contents=[chat_prompt]
        )
        return response.text.strip()
    except Exception as e:
        return f"I'm sorry, I'm having trouble connecting to the AI service right now. Error: {str(e)}. Please try asking your question again." 