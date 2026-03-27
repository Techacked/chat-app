'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import api from '../utils/api'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token')
      if (token) {
        // Set token in axios headers
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`
        // You could verify token here with a /me endpoint
        setUser({ token })
      }
    }
    setLoading(false)
  }, [])

  const login = async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password })
      const { token, user } = response.data

      if (typeof window !== 'undefined') {
        localStorage.setItem('token', token)
      }
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`
      setUser({ ...user, token })

      router.push('/chat')
      return { success: true }
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Login failed'
      }
    }
  }

  const register = async (username, email, password) => {
    try {
      // call backend register endpoint
      await api.post('/auth/register', { username, email, password })
      // login on successful registration to get token
      const loginRes = await api.post('/auth/login', { email, password })
      const { token, user } = loginRes.data

      if (typeof window !== 'undefined') {
        localStorage.setItem('token', token)
      }
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`
      setUser({ ...user, token })

      router.push('/chat')
      return { success: true }
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Registration failed'
      }
    }
  }

  const logout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token')
    }
    delete api.defaults.headers.common['Authorization']
    setUser(null)
    router.push('/login')
  }

  const value = {
    user,
    login,
    register,
    logout,
    loading
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}