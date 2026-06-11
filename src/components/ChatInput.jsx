import { useState } from 'react'

export default function ChatInput({ onSend, suggestions, disabled }) {
  const [value, setValue] = useState('')

  function handleSubmit(e) {
    e.preventDefault()
    if (!value.trim() || disabled) return
    onSend(value.trim())
    setValue('')
  }

  return (
    <div className="chat-input-wrapper">
      {suggestions && (
        <div className="chat-suggestions">
          {suggestions.map((s, i) => (
            <button
              key={i}
              className="chat-suggestion-chip"
              onClick={() => { if (!disabled) onSend(s) }}
              disabled={disabled}
            >
              {s}
            </button>
          ))}
        </div>
      )}
      <form onSubmit={handleSubmit} className="chat-input-area">
        <input
          type="text"
          className="chat-input"
          placeholder="Ask about skills, experience, projects..."
          value={value}
          onChange={e => setValue(e.target.value)}
          disabled={disabled}
          autoFocus
        />
        <button type="submit" className="chat-send-btn" disabled={disabled}>Send</button>
      </form>
    </div>
  )
}
