'use client'

import { useState, useRef, useEffect } from 'react'
import socketService from '../utils/socket'

export default function MessageInput({ onSendMessage, conversationId }) {
  const [message, setMessage] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const textareaRef = useRef(null)
  const typingTimeoutRef = useRef(null)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!message.trim()) return

    onSendMessage(message.trim())
    setMessage('')
    
    // Stop typing indicator
    if (isTyping) {
      socketService.sendTyping(conversationId, false)
      setIsTyping(false)
    }
    
    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  const handleInputChange = (e) => {
    setMessage(e.target.value)
    
    // Auto-resize textarea
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`
    }

    // Handle typing indicator
    if (e.target.value.trim() && !isTyping) {
      setIsTyping(true)
      socketService.sendTyping(conversationId, true)
    }

    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current)
    }

    // Set new timeout to stop typing indicator
    typingTimeoutRef.current = setTimeout(() => {
      if (isTyping) {
        setIsTyping(false)
        socketService.sendTyping(conversationId, false)
      }
    }, 1000)
  }

  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current)
      }
      if (isTyping) {
        socketService.sendTyping(conversationId, false)
      }
    }
  }, [conversationId, isTyping])

  return (
    <div className="p-4 border-t border-dark-border bg-dark-sidebar">
      <form onSubmit={handleSubmit} className="flex items-end space-x-3">
        <div className="flex-1 relative">
          <textarea
            ref={textareaRef}
            value={message}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            placeholder="Type a message..."
            className="w-full px-4 py-3 bg-dark-chat border border-dark-border rounded-2xl text-dark-text placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none min-h-[48px] max-h-[120px]"
            rows={1}
          />
        </div>
        
        <button
          type="submit"
          disabled={!message.trim()}
          className="p-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-full transition-colors flex-shrink-0"
        >
          <svg 
            className="w-5 h-5 text-white" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" 
            />
          </svg>
        </button>
      </form>
      
      <div className="text-xs text-gray-400 mt-2">
        Press Enter to send, Shift+Enter for new line
      </div>
    </div>
  )
}