import 'dotenv/config'
import express from 'express'
import cors from 'cors'

const app = express()
const port = process.env.PORT || 3001
const model = process.env.OPENAI_MODEL || 'gpt-4o-mini'

app.use(cors({ origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173' }))
app.use(express.json({ limit: '32kb' }))

app.get('/api/health', (_req, res) => res.json({ status: 'ok' }))

app.post('/api/chat', async (req, res) => {
  const { messages } = req.body
  if (!Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: 'A non-empty messages array is required.' })
  }
  if (!process.env.OPENAI_API_KEY) {
    return res.status(503).json({ error: 'The chat service is not configured. Add OPENAI_API_KEY to your .env file.' })
  }

  const safeMessages = messages
    .filter((message) => message && ['user', 'assistant'].includes(message.role))
    .slice(-20)
    .map(({ role, content }) => ({ role, content: String(content).slice(0, 8000) }))

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: { Authorization: `Bearer ${process.env.OPENAI_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ model, messages: safeMessages }),
    })
    const data = await response.json()
    if (!response.ok) {
      return res.status(response.status).json({ error: data.error?.message || 'The AI service returned an error.' })
    }
    return res.json({ message: data.choices?.[0]?.message?.content || 'I could not generate a response.' })
  } catch (error) {
    console.error('Chat request failed:', error)
    return res.status(502).json({ error: 'Unable to reach the AI service. Please try again.' })
  }
})

app.listen(port, () => console.log(`API server listening on http://localhost:${port}`))
