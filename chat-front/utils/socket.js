import { io } from 'socket.io-client'

class SocketService {
  constructor() {
    this.socket = null
    this.mockMode = false // Use real Socket.io connection in production/dev
  }

  connect(token) {
    if (this.mockMode) {
      // Mock socket connection
      this.socket = {
        connected: true,
        emit: (event, data) => {
          console.log('Mock socket emit:', event, data)
        },
        on: (event, callback) => {
          console.log('Mock socket listening to:', event)
        },
        off: (event) => {
          console.log('Mock socket off:', event)
        },
        disconnect: () => {
          console.log('Mock socket disconnected')
        }
      }
      return this.socket
    }

    if (this.socket?.connected) return this.socket

    const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:5000'
    
    this.socket = io(socketUrl, {
      auth: {
        token
      },
      transports: ['websocket', 'polling']
    })

    return this.socket
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect()
      this.socket = null
    }
  }

  joinConversation(conversationId) {
    if (this.socket) {
      this.socket.emit('join_conversation', conversationId)
    }
  }

  sendMessage(messageData) {
    if (this.socket) {
      this.socket.emit('send_message', messageData)
    }
  }

  sendTyping(conversationId, isTyping) {
    if (this.socket) {
      this.socket.emit('typing', { conversationId, isTyping })
    }
  }

  onReceiveMessage(callback) {
    if (this.socket) {
      this.socket.on('receive_message', callback)
    }
  }

  onOnlineUsers(callback) {
    if (this.socket) {
      this.socket.on('online_users', callback)
    }
  }

  onTyping(callback) {
    if (this.socket) {
      this.socket.on('typing', callback)
    }
  }

  offReceiveMessage() {
    if (this.socket) {
      this.socket.off('receive_message')
    }
  }

  offOnlineUsers() {
    if (this.socket) {
      this.socket.off('online_users')
    }
  }

  offTyping() {
    if (this.socket) {
      this.socket.off('typing')
    }
  }
}

const socketService = new SocketService()
export default socketService