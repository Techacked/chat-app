# Real-Time Chat App Frontend

A modern, dark-theme real-time chat application built with Next.js 14, Tailwind CSS, Socket.io, and Axios.

## Features

- 🌙 **Dark Theme** - Modern Discord/WhatsApp-style UI
- 💬 **Real-time Messaging** - Instant message delivery via Socket.io
- 👥 **Online Status** - See who's online/offline
- ⌨️ **Typing Indicators** - Know when someone is typing
- 🔐 **JWT Authentication** - Secure login/register system
- 📱 **Responsive Design** - Works on all devices
- 🚀 **Next.js 14** - App Router with modern React features

## Tech Stack

- **Next.js 14** (App Router)
- **Tailwind CSS** (Dark theme)
- **Socket.io-client** (Real-time communication)
- **Axios** (API calls)
- **React Context** (Global state management)
- **LocalStorage** (JWT token persistence)

## Project Structure

```
├── app/
│   ├── globals.css
│   ├── layout.js
│   ├── page.js
│   ├── login/
│   │   └── page.js
│   ├── register/
│   │   └── page.js
│   └── chat/
│       └── page.js
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
├── package.json
├── tailwind.config.js
├── postcss.config.js
├── next.config.js
└── .env.local
```

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Variables

Create `.env.local` file:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_SOCKET_URL=http://localhost:5000
```

### 3. Start Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:3000`

## Backend API Endpoints

The frontend expects these backend endpoints:

- `POST /auth/register` - User registration
- `POST /auth/login` - User login
- `GET /conversation/all` - Get user's conversations
- `POST /conversation/create` - Create new conversation
- `GET /message/:conversationId` - Get messages for conversation
- `POST /message/send` - Send a message

## Socket Events

### Emitted Events
- `join_conversation` - Join a conversation room
- `send_message` - Send a message
- `typing` - Typing indicator

### Listened Events
- `receive_message` - Receive new messages
- `online_users` - Get online users list
- `typing` - Typing indicators from other users

## Pages

### `/` (Home)
- Redirects to `/chat` if authenticated, otherwise `/login`

### `/login`
- Login form with email/password
- Redirects to `/chat` on success
- Link to register page

### `/register`
- Registration form with username/email/password
- Redirects to `/chat` on success
- Link to login page

### `/chat`
- Protected route (requires authentication)
- Main chat interface with sidebar and chat window
- Real-time messaging and status updates

## Components

### `Sidebar.jsx`
- Conversations list
- Online/offline status indicators
- New conversation modal
- User info and logout

### `ChatWindow.jsx`
- Chat header with user info
- Messages display area
- Typing indicators
- Auto-scroll functionality

### `MessageBubble.jsx`
- Individual message display
- Different styles for sent/received messages
- Timestamps and sender info

### `MessageInput.jsx`
- Message composition area
- Auto-resize textarea
- Typing indicator emission
- Send on Enter, new line on Shift+Enter

## Authentication Flow

1. User registers/logs in
2. JWT token stored in localStorage
3. Token added to all API requests via Axios interceptor
4. Socket connection authenticated with token
5. Protected routes check for valid token
6. Auto-logout on token expiration

## Dark Theme Colors

- Background: `#0d0d0d`
- Sidebar: `#1a1a1a`
- Chat window: `#121212`
- Text: `#e5e5e5`
- Borders: `#2a2a2a`
- Hover: `#2d2d2d`

## Build for Production

```bash
npm run build
npm start
```

## Development Notes

- The app uses React Context for global authentication state
- Socket connection is managed in a singleton service
- All API calls go through a configured Axios instance
- Auto-scroll behavior maintains chat UX
- Responsive design works on mobile and desktop
- Error handling for network failures and auth errors

## Browser Support

- Chrome/Edge 88+
- Firefox 85+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Mobile)