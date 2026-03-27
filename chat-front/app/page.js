'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function HomePage() {
  const [username, setUsername] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!username.trim()) return

    setLoading(true)
    
    try {
      // Store username in localStorage
      localStorage.setItem('chatUser', JSON.stringify({
        id: `user_${Date.now()}`,
        username: username.trim()
      }))
      
      // Navigate to chat
      router.push('/chat')
    } catch (error) {
      console.error('Error joining chat:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-dark-bg flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-dark-sidebar rounded-2xl p-8 shadow-2xl">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-dark-text mb-2">
              Welcome to Chat
            </h1>
            <p className="text-gray-400">
              Enter your username to start chatting
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                className="w-full px-4 py-3 bg-dark-input border border-dark-border rounded-xl text-dark-text placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                disabled={loading}
                autoFocus
              />
            </div>

            <button
              type="submit"
              disabled={!username.trim() || loading}
              className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-medium rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {loading ? 'Joining...' : 'Join Chat'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}