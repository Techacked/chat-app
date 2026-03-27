# Quick Setup Guide

## 1. Install Dependencies

```bash
npm install next@14.0.0 react react-dom socket.io-client axios zustand
npm install -D tailwindcss postcss autoprefixer eslint eslint-config-next
```

## 2. Initialize Tailwind CSS

```bash
npx tailwindcss init -p
```

## 3. Environment Setup

Create `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_SOCKET_URL=http://localhost:5000
```

## 4. Start Development

```bash
npm run dev
```

## 5. Backend Requirements

Your backend should have these endpoints running on `http://localhost:5000`:

### Auth Endpoints
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Conversation Endpoints  
- `GET /api/conversation/all` - Get user conversations
- `POST /api/conversation/create` - Create new conversation

### Message Endpoints
- `GET /api/message/:conversationId` - Get conversation messages
- `POST /api/message/send` - Send new message

### Socket Events
Your backend should handle these socket events:
- `join_conversation` - User joins conversation room
- `send_message` - User sends message
- `typing` - User typing status
- `online_users` - Broadcast online users
- `receive_message` - Broadcast new messages

## 6. Test the App

1. Open `http://localhost:3000`
2. Register a new account
3. Login with credentials
4. Start chatting!

## Folder Structure Created

```
your-app/
├── app/
│   ├── globals.css
│   ├── layout.js
│   ├── page.js
│   ├── login/page.js
│   ├── register/page.js
│   └── chat/page.js
├── components/
│   ├── Sidebar.jsx
│   ├── ChatWindow.jsx
│   ├── MessageBubble.jsx
│   └── MessageInput.jsx
├── context/
│   └── AuthContext.js
├── utils/
│   ├── api.js
│   └── socket.js
└── Configuration files
```

The app is now ready to use with your backend!