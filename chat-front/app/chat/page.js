'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Sidebar from '../../components/Sidebar'
import NewChatWindow from '../../components/NewChatWindow'
import socketService from '../../utils/socket'

export default function ChatPage() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [activeChat, setActiveChat] = useState(null)
  const [chatHistory, setChatHistory] = useState([])
  const [messages, setMessages] = useState([])
  const [onlineUsers, setOnlineUsers] = useState([])
  const [typingUsers, setTypingUsers] = useState([])

  useEffect(() => {
    // Get user from localStorage
    const storedUser = localStorage.getItem('chatUser')
    if (!storedUser) {
      router.push('/')
      return
    }

    const userData = JSON.parse(storedUser)
    setUser(userData)

    // Initialize socket connection
    const socket = socketService.connect(userData)
    
    // Listen for online users
    socket.on('online_users', (users) => {
      setOnlineUsers(users)
    })

    // Listen for messages
    socket.on('receive_message', (message) => {
      if (message.chatId === activeChat?.id) {
        setMessages(prev => [...prev, message])
      }
    })

    // Listen for typing
    socket.on('typing', (data) => {
      if (data.chatId === activeChat?.id && data.userId !== userData.id) {
        if (data.isTyping) {
          setTypingUsers(prev => {
            const existing = prev.find(u => u.userId === data.userId)
            if (!existing) {
              return [...prev, { userId: data.userId, username: data.username }]
            }
            return prev
          })
        } else {
          setTypingUsers(prev => prev.filter(u => u.userId !== data.userId))
        }
      }
    })

    return () => {
      socketService.disconnect()
    }
  }, [router, activeChat])

  if (!user) {
    return (
      <div className="min-h-screen bg-dark-bg flex items-center justify-center">
        <div className="text-dark-text">Loading...</div>
      </div>
    )
  }

  return (
    <div className="h-screen bg-dark-bg flex overflow-hidden">
      <Sidebar 
        user={user}
        chatHistory={chatHistory}
        setChatHistory={setChatHistory}
        activeChat={activeChat}
        setActiveChat={setActiveChat}
        onlineUsers={onlineUsers}
      />
      <div className="flex-1 flex flex-col">
        {activeChat ? (
          <NewChatWindow 
            user={user}
            activeChat={activeChat}
            messages={messages}
            setMessages={setMessages}
            typingUsers={typingUsers}
            onlineUsers={onlineUsers}
          />
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center text-gray-400">
              <div className="text-6xl mb-4">💬</div>
              <h2 className="text-xl font-medium mb-2">No chat selected</h2>
              <p>Search for a user to start chatting</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}