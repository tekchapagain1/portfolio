import { useEffect, useRef } from 'react'

export default function ChatMessages({ messages, isTyping, stage }) {
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, stage])

  return (
    <div className="chat-messages">
      {messages.length === 0 && (
        <div className="chat-empty">
          Ask me anything about the resume!<br />
          Try: <em>&quot;what skills do you have&quot;</em> or <em>&quot;tell me about your experience&quot;</em>
        </div>
      )}
      {messages.map((msg, i) => (
        <div key={i} className={`chat-msg chat-msg--${msg.role}`}>
          <div className="chat-msg-label">
            {msg.role === 'user' ? 'You' : 'ResumeBot'}
          </div>
          <div className="chat-msg-text">
            {msg.role === 'bot' && msg.isTyping ? (
              <span className="chat-typing">
                {formatResponse(msg.text)}
                <span className="chat-cursor">&#x2588;</span>
              </span>
            ) : (
              formatResponse(msg.text)
            )}
          </div>
        </div>
      ))}

      {isTyping && stage && (
        <div className="chat-stage">
          <span className="chat-stage-spinner">&#x25E0;</span>
          {stage}
        </div>
      )}

      <div ref={bottomRef} />
    </div>
  )
}

function formatResponse(text) {
  if (!text) return null
  return renderSimpleMarkdown(text)
}

function renderSimpleMarkdown(text) {
  const lines = text.split('\n')
  const result = []
  let inList = false

  for (let i = 0; i < lines.length; i++) {
    const trimmed = lines[i].trim()
    if (trimmed.startsWith('- ')) {
      const item = renderListItem(trimmed.slice(2), `${i}`)
      if (!inList) {
        inList = true
        result.push(<ul key={`ul-${i}`} className="chat-list">{item}</ul>)
      } else {
        const idx = result.length - 1
        const existing = result[idx]
        result[idx] = <ul key={existing.key} className="chat-list">{existing.props.children}{item}</ul>
      }
    } else {
      inList = false
      if (trimmed === '') {
        result.push(<br key={`br-${i}`} />)
      } else {
        result.push(<p key={`p-${i}`} className="chat-paragraph">{renderInline(lines[i])}</p>)
      }
    }
  }
  return result
}

function renderListItem(text, key) {
  return <li key={key}>{renderInline(text)}</li>
}

function renderInline(text) {
  const parts = []
  let remaining = text
  let key = 0

  while (remaining.length > 0) {
    const codeMatch = remaining.match(/`([^`]+)`/)
    if (codeMatch?.index !== undefined) {
      if (codeMatch.index > 0) parts.push(remaining.slice(0, codeMatch.index))
      parts.push(<code key={key++} className="chat-inline-code">{codeMatch[1]}</code>)
      remaining = remaining.slice(codeMatch.index + codeMatch[0].length)
      continue
    }
    const boldMatch = remaining.match(/\*\*([^*]+)\*\*/)
    if (boldMatch?.index !== undefined) {
      if (boldMatch.index > 0) parts.push(remaining.slice(0, boldMatch.index))
      parts.push(<strong key={key++}>{boldMatch[1]}</strong>)
      remaining = remaining.slice(boldMatch.index + boldMatch[0].length)
      continue
    }
    parts.push(remaining)
    break
  }
  return parts.length > 0 ? parts : text
}
