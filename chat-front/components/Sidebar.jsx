'use client'

import { useState } from 'react'

export default function Sidebar({ 
  user, 
  chatHistory, 
  setChatHistory, 
  activeChat, 
  setActiveChat, 
  onlineUsers 
}) {
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [searching, setSearching] = useState(false)
  const [searchError, setSearchError] = useState('')

  const handleSearch = async (e) => {
    e.preventDefault()
    if (!searchQuery.trim()) return

    setSearching(true)
    setSearchError('')
    
    try {
      // Mock search for now - replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // Mock search results
      const mockUsers = [
        { id: 'user_1', username: 'john_doe' },
        { id: 'user_2', username: 'jane_smith' },
        { id: 'user_3', username: 'mike_wilson' }
      ]
      
      const results = mockUsers.filter(u => 
        u.username.toLowerCase().includes(searchQuery.toLowerCase()) &&
        u.id !== user.id
      )
      
      if (results.length === 0) {
        setSearchError('User not found')
        setSearchResults([])
      } else {
        setSearchResults(results)
        setSearchError('')
      }
    } catch (error) {
      setSearchError('Error searching users')
      setSearchResults([])
    } finally {
      setSearching(false)
    }
  }

  const startChat = (targetUser) => {
    // Check if chat already exists
    const existingChat = chatHistory.find(chat => 
      chat.participants.some(p => p.id === targetUser.id)
    )

    if (existingChat) {
      setActiveChat(existingChat)
    } else {
      // Create new chat
      const newChat = {
        id: `chat_${user.id}_${targetUser.id}_${Date.now()}`,
        participants: [user, targetUser],
        lastMessage: null,
        createdAt: new Date().toISOString()
      }
      
      setChatHistory(prev => [newChat, ...prev])
      setActiveChat(newChat)
    }
    
    // Clear search
    setSearchQuery('')
    setSearchResults([])
    setSearchError('')
  }

  const getOtherUser = (chat) => {
    return chat.participants.find(p => p.id !== user.id)
  }

  const isUserOnline = (userId) => {
    return onlineUsers.includes(userId)
  }

  return (
    <div className="w-80 bg-dark-sidebar border-r border-dark-border flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-dark-border">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-semibold text-dark-text">Chats</h1>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-medium">
                {user?.username?.[0]?.toUpperCase()}
              </span>
            </div>
          </div>
        </div>

        {/* Search */}
        <form onSubmit={handleSearch} className="space-y-2">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search users..."
              className="w-full px-4 py-2 bg-dark-input border border-dark-border rounded-lg text-dark-text placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              disabled={searching}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-blue-500"
            >
              {searching ? (
                <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              )}
            </button>
          </div>
          
          {searchError && (
            <p className="text-red-400 text-sm">{searchError}</p>
          )}
        </form>
      </div>

      {/* Search Results */}
      {searchResults.length > 0 && (
        <div className="border-b border-dark-border">
          <div className="p-3 text-sm text-gray-400 font-medium">Search Results</div>
          {searchResults.map((searchUser) => (
            <div
              key={searchUser.id}
              onClick={() => startChat(searchUser)}
              className="p-4 hover:bg-dark-hover cursor-pointer transition-colors"
            >
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-medium">
                      {searchUser.username[0].toUpperCase()}
                    </span>
                  </div>
                  {isUserOnline(searchUser.id) && (
                    <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-online rounded-full border-2 border-dark-sidebar"></div>
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="text-dark-text font-medium">{searchUser.username}</h3>
                  <div className={`text-xs ${isUserOnline(searchUser.id) ? 'text-online' : 'text-offline'}`}>
                    {isUserOnline(searchUser.id) ? 'Online' : 'Last seen recently'}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Chat History */}
      <div className="flex-1 overflow-y-auto">
        {chatHistory.length === 0 ? (
          <div className="p-4 text-center text-gray-400">
            <div className="text-4xl mb-2">💬</div>
            <p>No chats yet</p>
            <p className="text-sm">Search for users to start chatting</p>
          </div>
        ) : (
          chatHistory.map((chat) => {
            const otherUser = getOtherUser(chat)
            const isSelected = activeChat?.id === chat.id

            return (
              <div
                key={chat.id}
                onClick={() => setActiveChat(chat)}
                className={`p-4 border-b border-dark-border cursor-pointer transition-colors ${
                  isSelected ? 'bg-dark-hover' : 'hover:bg-dark-hover'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-medium">
                        {otherUser?.username?.[0]?.toUpperCase()}
                      </span>
                    </div>
                    {isUserOnline(otherUser?.id) && (
                      <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-online rounded-full border-2 border-dark-sidebar"></div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="text-dark-text font-medium truncate">
                        {otherUser?.username}
                      </h3>
                      <div className={`text-xs ${isUserOnline(otherUser?.id) ? 'text-online' : 'text-offline'}`}>
                        {isUserOnline(otherUser?.id) ? 'Online' : 'Offline'}
                      </div>
                    </div>
                    {chat.lastMessage && (
                      <p className="text-sm text-gray-400 truncate">
                        {chat.lastMessage.content}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}