'use client'

import { useEffect, useRef } from 'react'
import socketService from '../utils/socket'
import MessageBubble from './MessageBubble'
import MessageInput from './MessageInput'

export default function ChatWindow({ 
  user, 
  activeChat, 
  messages, 
  setMessages, 
  typingUsers, 
  onlineUsers 
}) {
  const messagesEndRef = useRef(null)

  // Join chat when active chat changes
  useEffect(() => {
    if (activeChat) {
      socketService.joinChat(activeChat.id)
      // Load messages for this chat (mock for now)
      setMessages([])
    }
  }, [activeChat, setMessages])

  // Auto scroll to bottom
  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleSendMessage = (content) => {
    if (!content.trim() || !activeChat) return

    const messageData = {
      id: `msg_${Date.now()}`,
      chatId: activeChat.id,
      content: content.trim(),
      senderId: user.id,
      senderUsername: user.username,
      timestamp: new Date().toISOString()
    }

    // Add message to UI immediately
    setMessages(prev => [...prev, messageData])
    
    // Send via socket
    socketService.sendMessage(messageData)
  }

  const getOtherUser = () => {
    return activeChat?.participants.find(p => p.id !== user?.id)
  }

  const isUserOnline = (userId) => {
    return onlineUsers.includes(userId)
  }

  const otherUser = getOtherUser()
  const chatTypingUsers = typingUsers.filter(u => u.userId !== user?.id)

  if (!activeChat) return null

  return (
    <div className="flex-1 flex flex-col bg-dark-chat">
      {/* Header */}
      <div className="p-4 border-b border-dark-border bg-dark-sidebar">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
            <span className="text-white font-medium">
              {otherUser?.username?.[0]?.toUpperCase()}
            </span>
          </div>
          <div>
            <h2 className="text-dark-text font-medium">{otherUser?.username}</h2>
            <div className={`text-xs ${isUserOnline(otherUser?.id) ? 'text-online' : 'text-offline'}`}>
              {isUserOnline(otherUser?.id) ? 'Online' : 'Last seen recently'}
            </div>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center text-gray-400">
              <div className="text-4xl mb-2">👋</div>
              <p>Start your conversation with {otherUser?.username}</p>
            </div>
          </div>
        ) : (
          messages.map((message, index) => (
            <MessageBubble
              key={message.id || index}
              message={message}
              isOwn={message.senderId === user?.id}
            />
          ))
        )}

        {/* Typing indicator */}
        {chatTypingUsers.length > 0 && (
          <div className="flex items-center space-x-2 text-gray-400 text-sm">
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            </div>
            <span>
              {chatTypingUsers[0].username} is typing...
            </span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <MessageInput onSendMessage={handleSendMessage} activeChat={activeChat} user={user} />
    </div>
  )
}