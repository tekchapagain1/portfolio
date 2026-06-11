import { useState, useRef, useCallback, useEffect } from 'react'
import ChatMessages from './ChatMessages'
import ChatInput from './ChatInput'
import { getChatResponse } from '../utils/chatBot'

const MAX_MESSAGES = 50
const TYPING_SPEED = 18
const INITIAL_DELAY = 400

const STAGES = [
  'Spinning up Databricks cluster...',
  'Scanning resume tables...',
  'Running analysis...',
  'Formatting response...',
]

const SUGGESTIONS = [
  'Tell me about yourself',
  'What skills do you have?',
  'Describe your Databricks experience',
  'Where did you work?',
]

export default function ChatMode() {
  const [messages, setMessages] = useState([{
    role: 'bot',
    text: "Hi! I'm ResumeBot. Ask me anything about Tek Chapagain's background, or switch to **Query** mode to run SQL on the resume!",
  }])
  const [isTyping, setIsTyping] = useState(false)
  const [stageIdx, setStageIdx] = useState(-1)
  const intervalsRef = useRef([])

  function cleanup() {
    intervalsRef.current.forEach(clearInterval)
    intervalsRef.current = []
  }

  useEffect(() => cleanup, [])

  const handleSend = useCallback((text) => {
    cleanup()
    setIsTyping(true)
    setStageIdx(0)

    setMessages(prev => {
      const next = [...prev, { role: 'user', text }]
      return next.length > MAX_MESSAGES ? next.slice(-MAX_MESSAGES) : next
    })

    // Cycle through stages
    const stageInterval = setInterval(() => {
      setStageIdx(prev => Math.min(prev + 1, STAGES.length - 1))
    }, 600)
    intervalsRef.current.push(stageInterval)

    const response = getChatResponse(text)

    // Add bot placeholder
    setTimeout(() => {
      clearInterval(stageInterval)
      setStageIdx(-1)

      setMessages(prev => {
        const next = [...prev, { role: 'bot', text: '', isTyping: true }]
        return next.length > MAX_MESSAGES ? next.slice(-MAX_MESSAGES) : next
      })

      // Stream character by character
      let idx = 0
      const typeInterval = setInterval(() => {
        idx++
        if (idx > response.length) {
          clearInterval(typeInterval)
          setIsTyping(false)
          setMessages(prev => {
            const msgs = [...prev]
            const last = msgs[msgs.length - 1]
            msgs[msgs.length - 1] = { ...last, text: response, isTyping: false }
            return msgs
          })
          return
        }
        setMessages(prev => {
          const msgs = [...prev]
          const last = msgs[msgs.length - 1]
          msgs[msgs.length - 1] = { ...last, text: response.slice(0, idx) }
          return msgs
        })
      }, TYPING_SPEED)
      intervalsRef.current.push(typeInterval)
    }, INITIAL_DELAY)
  }, [])

  return (
    <div className="chat-mode">
      <ChatMessages messages={messages} isTyping={isTyping} stage={stageIdx >= 0 ? STAGES[stageIdx] : null} />
      <ChatInput onSend={handleSend} suggestions={SUGGESTIONS} disabled={isTyping} />
    </div>
  )
}
