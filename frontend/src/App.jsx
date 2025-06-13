import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom'
import './App.css'

function UploadPage({ setExtractedText }) {
  const [file, setFile] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleFileChange = (e) => {
    setFile(e.target.files[0])
    setError('')
  }

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a file.')
      return
    }
    setLoading(true)
    const formData = new FormData()
    formData.append('file', file)
    try {
      const res = await fetch('http://localhost:8000/upload', {
        method: 'POST',
        body: formData,
      })
      const data = await res.json()
      if (res.ok) {
        setExtractedText(data.text)
        navigate('/generate')
      } else {
        setError(data.detail || 'Upload failed.')
      }
    } catch (err) {
      setError('Upload failed. Make sure the backend is running.')
    }
    setLoading(false)
  }

  return (
    <div className="page">
      <h2>📚 Upload Educational Document</h2>
      <p>Upload a PDF or text file to get started with AI-powered assessments.</p>
      <div className="upload-area">
        <input type="file" accept=".pdf,.txt" onChange={handleFileChange} />
        {file && <p className="file-info">Selected: {file.name}</p>}
      </div>
      <button onClick={handleUpload} disabled={loading}>
        {loading ? '⏳ Uploading...' : '📤 Upload & Extract Text'}
      </button>
      {error && <div className="error">{error}</div>}
    </div>
  )
}

function GeneratePage({ extractedText, setAssessment, setMode }) {
  const [mode, setLocalMode] = useState('essay')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleGenerate = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await fetch('http://localhost:8000/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: extractedText, mode }),
      })
      const data = await res.json()
      if (res.ok) {
        setAssessment(data.result)
        setMode(mode)
        navigate('/assessment')
      } else {
        setError(data.detail || 'Generation failed.')
      }
    } catch (err) {
      setError('Generation failed. Make sure the backend is running.')
    }
    setLoading(false)
  }

  return (
    <div className="page">
      <h2>🎯 Generate Assessment</h2>
      <p>Choose the type of assessment you'd like to create from your document.</p>
      <div className="radio-group">
        <label className="radio-label">
          <input type="radio" value="essay" checked={mode === 'essay'} onChange={() => setLocalMode('essay')} />
          <span>📝 Essay (300-400 words)</span>
        </label>
        <label className="radio-label">
          <input type="radio" value="mcq" checked={mode === 'mcq'} onChange={() => setLocalMode('mcq')} />
          <span>❓ Multiple Choice Quiz (20 questions)</span>
        </label>
      </div>
      <button onClick={handleGenerate} disabled={loading}>
        {loading ? '🤖 Generating...' : '✨ Generate Assessment'}
      </button>
      {error && <div className="error">{error}</div>}
    </div>
  )
}

function AssessmentPage({ mode, assessment, setUserAnswer, userAnswer, setFeedback, extractedText }) {
  const [answer, setAnswer] = useState(userAnswer || '')
  const [mcqAnswers, setMcqAnswers] = useState({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [questions, setQuestions] = useState([])
  const navigate = useNavigate()

  // Parse MCQ JSON on component mount
  useState(() => {
    if (mode === 'mcq' && assessment) {
      try {
        const parsed = JSON.parse(assessment)
        setQuestions(Array.isArray(parsed) ? parsed : [])
      } catch (e) {
        setQuestions([])
      }
    }
  }, [assessment, mode])

  const handleSubmit = async () => {
    setLoading(true)
    setError('')
    const finalAnswer = mode === 'mcq' ? JSON.stringify(mcqAnswers) : answer
    try {
      const res = await fetch('http://localhost:8000/grade', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: extractedText, mode, user_answer: finalAnswer, generated: assessment }),
      })
      const data = await res.json()
      if (res.ok) {
        setFeedback(data.result)
        setUserAnswer(finalAnswer)
        navigate('/feedback')
      } else {
        setError(data.detail || 'Grading failed.')
      }
    } catch (err) {
      setError('Grading failed. Make sure the backend is running.')
    }
    setLoading(false)
  }

  if (mode === 'essay') {
    return (
      <div className="page">
        <h2>📝 Essay Assessment</h2>
        <div className="prompt-box">
          <pre>{assessment}</pre>
        </div>
        <textarea 
          value={answer} 
          onChange={e => setAnswer(e.target.value)} 
          rows={12} 
          placeholder="Write your 300-400 word essay here..."
          className="essay-textarea"
        />
        <div className="word-count">Words: {answer.split(/\s+/).filter(w => w.length > 0).length}</div>
        <button onClick={handleSubmit} disabled={loading || answer.trim().length < 50}>
          {loading ? '📊 Grading...' : '📤 Submit Essay'}
        </button>
        {error && <div className="error">{error}</div>}
      </div>
    )
  }

  return (
    <div className="page">
      <h2>❓ Multiple Choice Quiz</h2>
      {questions.length > 0 ? (
        <div className="mcq-container">
          {questions.map((q, i) => (
            <div key={i} className="question-block">
              <h4>Question {i + 1}</h4>
              <p>{q.question}</p>
              <div className="choices">
                {q.choices && q.choices.map((choice, j) => (
                  <label key={j} className="choice-label">
                    <input 
                      type="radio" 
                      name={`q${i}`} 
                      value={choice}
                      onChange={() => setMcqAnswers({...mcqAnswers, [i]: choice})}
                    />
                    <span>{choice}</span>
                  </label>
                ))}
              </div>
            </div>
          ))}
          <button onClick={handleSubmit} disabled={loading}>
            {loading ? '📊 Grading...' : '📤 Submit Quiz'}
          </button>
        </div>
      ) : (
        <div className="raw-mcq">
          <pre>{assessment}</pre>
          <textarea 
            value={answer} 
            onChange={e => setAnswer(e.target.value)} 
            rows={8} 
            placeholder="Enter your answers here..."
          />
          <button onClick={handleSubmit} disabled={loading}>
            {loading ? '📊 Grading...' : '📤 Submit Answers'}
          </button>
        </div>
      )}
      {error && <div className="error">{error}</div>}
    </div>
  )
}

function FeedbackPage({ feedback }) {
  const navigate = useNavigate()
  return (
    <div className="page">
      <h2>📊 Your Results</h2>
      <div className="feedback-box">
        <pre>{feedback}</pre>
      </div>
      <div className="action-buttons">
        <button onClick={() => navigate('/chat')}>💬 Ask a Tutor</button>
        <button onClick={() => navigate('/')} className="secondary">🔄 Start Over</button>
      </div>
    </div>
  )
}

function ChatPage({ extractedText }) {
  const [history, setHistory] = useState([])
  const [question, setQuestion] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSend = async () => {
    if (!question.trim()) return
    setLoading(true)
    setError('')
    const userQuestion = question
    setQuestion('')
    setHistory([...history, `You: ${userQuestion}`])
    
    try {
      const res = await fetch('http://localhost:8000/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: extractedText, history, question: userQuestion }),
      })
      const data = await res.json()
      if (res.ok) {
        setHistory(prev => [...prev, `🤖 Tutor: ${data.result}`])
      } else {
        setError(data.detail || 'Chat failed.')
        setHistory(prev => [...prev, `❌ Error: ${data.detail || 'Chat failed.'}`])
      }
    } catch (err) {
      setError('Chat failed. Make sure the backend is running.')
      setHistory(prev => [...prev, `❌ Error: Chat failed.`])
    }
    setLoading(false)
  }

  return (
    <div className="page">
      <h2>�� AI Tutor Chat</h2>
      <div className="chat-history">
        {history.length === 0 && (
          <div className="chat-placeholder">Ask me anything about the content you uploaded!</div>
        )}
        {history.map((msg, i) => (
          <div key={i} className={`chat-message ${msg.startsWith('You:') ? 'user' : 'tutor'}`}>
            {msg}
          </div>
        ))}
      </div>
      <div className="chat-input">
        <textarea 
          value={question} 
          onChange={e => setQuestion(e.target.value)} 
          rows={3} 
          placeholder="Ask a question about the content..."
          onKeyPress={e => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSend())}
        />
        <button onClick={handleSend} disabled={loading || !question.trim()}>
          {loading ? '💭 Thinking...' : '📤 Send'}
        </button>
      </div>
      {error && <div className="error">{error}</div>}
    </div>
  )
}

function App() {
  const [extractedText, setExtractedText] = useState('')
  const [assessment, setAssessment] = useState('')
  const [mode, setMode] = useState('essay')
  const [userAnswer, setUserAnswer] = useState('')
  const [feedback, setFeedback] = useState('')

  return (
    <Router>
      <div className="app-header">
        <h1>🎓 AI Assessment Tool</h1>
        <nav>
          <Link to="/">Upload</Link>
          <Link to="/generate">Generate</Link>
          <Link to="/assessment">Assessment</Link>
          <Link to="/feedback">Feedback</Link>
          <Link to="/chat">Chat</Link>
        </nav>
      </div>
      <Routes>
        <Route path="/" element={<UploadPage setExtractedText={setExtractedText} />} />
        <Route path="/generate" element={<GeneratePage extractedText={extractedText} setAssessment={setAssessment} setMode={setMode} />} />
        <Route path="/assessment" element={<AssessmentPage mode={mode} assessment={assessment} setUserAnswer={setUserAnswer} userAnswer={userAnswer} setFeedback={setFeedback} extractedText={extractedText} />} />
        <Route path="/feedback" element={<FeedbackPage feedback={feedback} />} />
        <Route path="/chat" element={<ChatPage extractedText={extractedText} />} />
      </Routes>
    </Router>
  )
}

export default App
