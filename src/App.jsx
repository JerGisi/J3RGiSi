import { useEffect, useRef, useState } from 'react'

const starterMessage = { role: 'assistant', content: 'Hello! I’m Orbit. Tell me what you’re working on and I’ll help you think it through.' }
const SparkIcon = () => <span className="spark" aria-hidden="true">✦</span>

function App() {
  const [messages, setMessages] = useState([starterMessage])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const endRef = useRef(null)

  useEffect(() => endRef.current?.scrollIntoView({ behavior: 'smooth' }), [messages, loading])

  async function sendMessage(event) {
    event.preventDefault()
    const content = input.trim()
    if (!content || loading) return
    const nextMessages = [...messages, { role: 'user', content }]
    setMessages(nextMessages); setInput(''); setError(''); setLoading(true)
    try {
      const response = await fetch('/api/chat', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ messages: nextMessages }),
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'Something went wrong.')
      setMessages([...nextMessages, { role: 'assistant', content: data.message }])
    } catch (requestError) { setError(requestError.message) } finally { setLoading(false) }
  }

  function clearConversation() { setMessages([starterMessage]); setError('') }

  return (
    <main className="app-shell">
      <aside className="sidebar">
        <div className="brand"><SparkIcon /> orbit</div>
        <div className="sidebar-copy">
          <span className="eyebrow">Your thinking space</span>
          <h1>Ideas, refined.</h1>
          <p>A calm place to ask questions, explore possibilities, and make progress.</p>
        </div>
        <div className="sidebar-footer"><span className="status-dot" /> AI assistant online</div>
      </aside>
      <section className="chat-panel" aria-label="Chat with Orbit">
        <header className="chat-header">
          <div><span className="eyebrow">Conversation</span><h2>New conversation</h2></div>
          <button className="clear-button" onClick={clearConversation}>Clear <span>⌘ K</span></button>
        </header>
        <div className="messages">
          {messages.map((message, index) => (
            <article className={`message-row ${message.role}`} key={`${message.role}-${index}`}>
              {message.role === 'assistant' && <div className="avatar"><SparkIcon /></div>}
              <div className="message-content"><span className="message-author">{message.role === 'assistant' ? 'Orbit' : 'You'}</span><p>{message.content}</p></div>
            </article>
          ))}
          {loading && <article className="message-row assistant"><div className="avatar"><SparkIcon /></div><div className="message-content"><span className="message-author">Orbit</span><div className="typing"><i /><i /><i /></div></div></article>}
          <div ref={endRef} />
        </div>
        <div className="composer-wrap">
          {error && <div className="error-message" role="alert">{error}</div>}
          <form className="composer" onSubmit={sendMessage}>
            <textarea value={input} onChange={(event) => setInput(event.target.value)} onKeyDown={(event) => {
              if (event.key === 'Enter' && !event.shiftKey) { event.preventDefault(); event.currentTarget.form.requestSubmit() }
            }} placeholder="Ask Orbit anything..." rows="1" aria-label="Message" />
            <button className="send-button" type="submit" disabled={!input.trim() || loading} aria-label="Send message">↑</button>
          </form>
          <p className="composer-hint">Orbit can make mistakes. Check important information.</p>
        </div>
      </section>
    </main>
  )
}

export default App
