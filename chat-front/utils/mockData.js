// Mock data for testing the chat interface

export const mockUsers = [
  {
    _id: 'user-1',
    username: 'john_doe',
    email: 'john@example.com'
  },
  {
    _id: 'user-2',
    username: 'jane_smith',
    email: 'jane@example.com'
  },
  {
    _id: 'user-3',
    username: 'mike_wilson',
    email: 'mike@example.com'
  },
  {
    _id: 'user-4',
    username: 'sarah_jones',
    email: 'sarah@example.com'
  }
]

export const mockConversations = [
  {
    _id: 'conv-1',
    participants: [
      { _id: 'user-1', username: 'john_doe' },
      { _id: 'user-2', username: 'jane_smith' }
    ],
    lastMessage: {
      content: 'Hey, how are you doing?',
      createdAt: new Date(Date.now() - 1000 * 60 * 5).toISOString()
    }
  },
  {
    _id: 'conv-2',
    participants: [
      { _id: 'user-1', username: 'john_doe' },
      { _id: 'user-3', username: 'mike_wilson' }
    ],
    lastMessage: {
      content: 'Thanks for the help!',
      createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString()
    }
  },
  {
    _id: 'conv-3',
    participants: [
      { _id: 'user-1', username: 'john_doe' },
      { _id: 'user-4', username: 'sarah_jones' }
    ],
    lastMessage: {
      content: 'See you tomorrow!',
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString()
    }
  }
]

export const mockMessages = {
  'conv-1': [
    {
      _id: 'msg-1',
      content: 'Hi there! How are you?',
      sender: { _id: 'user-2', username: 'jane_smith' },
      conversationId: 'conv-1',
      createdAt: new Date(Date.now() - 1000 * 60 * 10).toISOString()
    },
    {
      _id: 'msg-2',
      content: 'I\'m doing great! Thanks for asking. How about you?',
      sender: { _id: 'user-1', username: 'john_doe' },
      conversationId: 'conv-1',
      createdAt: new Date(Date.now() - 1000 * 60 * 8).toISOString()
    },
    {
      _id: 'msg-3',
      content: 'Pretty good! Just working on some projects.',
      sender: { _id: 'user-2', username: 'jane_smith' },
      conversationId: 'conv-1',
      createdAt: new Date(Date.now() - 1000 * 60 * 6).toISOString()
    },
    {
      _id: 'msg-4',
      content: 'Hey, how are you doing?',
      sender: { _id: 'user-2', username: 'jane_smith' },
      conversationId: 'conv-1',
      createdAt: new Date(Date.now() - 1000 * 60 * 5).toISOString()
    }
  ],
  'conv-2': [
    {
      _id: 'msg-5',
      content: 'Can you help me with the project?',
      sender: { _id: 'user-3', username: 'mike_wilson' },
      conversationId: 'conv-2',
      createdAt: new Date(Date.now() - 1000 * 60 * 45).toISOString()
    },
    {
      _id: 'msg-6',
      content: 'Sure! What do you need help with?',
      sender: { _id: 'user-1', username: 'john_doe' },
      conversationId: 'conv-2',
      createdAt: new Date(Date.now() - 1000 * 60 * 40).toISOString()
    },
    {
      _id: 'msg-7',
      content: 'I\'m having trouble with the authentication flow.',
      sender: { _id: 'user-3', username: 'mike_wilson' },
      conversationId: 'conv-2',
      createdAt: new Date(Date.now() - 1000 * 60 * 35).toISOString()
    },
    {
      _id: 'msg-8',
      content: 'Thanks for the help!',
      sender: { _id: 'user-3', username: 'mike_wilson' },
      conversationId: 'conv-2',
      createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString()
    }
  ],
  'conv-3': [
    {
      _id: 'msg-9',
      content: 'Are we still meeting tomorrow?',
      sender: { _id: 'user-4', username: 'sarah_jones' },
      conversationId: 'conv-3',
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString()
    },
    {
      _id: 'msg-10',
      content: 'Yes, 2 PM at the coffee shop!',
      sender: { _id: 'user-1', username: 'john_doe' },
      conversationId: 'conv-3',
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2.5).toISOString()
    },
    {
      _id: 'msg-11',
      content: 'See you tomorrow!',
      sender: { _id: 'user-4', username: 'sarah_jones' },
      conversationId: 'conv-3',
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString()
    }
  ]
}

export const mockOnlineUsers = ['user-2', 'user-4']