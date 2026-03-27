# Chat App

## Overview

This repository contains a real-time chat application with:
- Backend: Node.js + Express + Socket.io + MongoDB
- Frontend: Next.js + React + Tailwind

### Key features
- User registration + login (JWT authentication)
- Conversations between users
- Message history
- Real-time message delivery via Socket.io
- Online status tracking


## Folder Structure

- `chat-backend/`
  - `config/` - database connection config
  - `controllers/` - API business logic
  - `middleware/` - auth middleware
  - `models/` - Mongoose schemas
  - `routes/` - Express routes
  - `sockets/` - Socket.io event handling
  - `server.js` - app and socket server entry
  - `.env` - secrets (MONGO_URI, JWT_SECRET)

- `chat-front/`
  - `app/` - Next.js app routes (`page.js` and feature pages)
  - `components/` - UI components (Sidebar, MessageBubble, etc.)
  - `context/` - Auth context
  - `utils/` - API and socket clients
  - `public/` - static files

- `TODO.md` - project notes


## System Architecture

1. Client logs in and receives JWT.
2. Client requests backend REST endpoints with `Authorization: Bearer <token>`.
3. Backend `authMiddleware` verifies JWT and attaches `req.user`.
4. Backend stores users/conversations/messages in MongoDB.
5. Client opens Socket.io connection with token (`auth.token`).
6. Socket middleware verifies token and sets `socket.userId`.
7. Real-time events:
   - `join_conversation` -> `socket.join(conversationId)`
   - `send_message` -> create Message in DB then `io.to(conversationId).emit('receive_message', message)`
   - `disconnect` -> mark user offline


## Environment variables (.env)

#### `chat-backend/.env`
```env
MONGO_URI=mongodb+srv://alikasif9910_db_user:bAA2kTANbh09hDVw@cluster1.hbx7m0y.mongodb.net/chat-app?retryWrites=true&w=majority
JWT_SECRET=YOUR_SECRET_HERE
PORT=5000
```


## Backend setup

```bash
cd chat-backend
npm install
npm run dev
```

### Sanity validation
- Access: `http://localhost:5000/api/auth/register`
- Login: `http://localhost:5000/api/auth/login`


## Frontend setup

```bash
cd chat-front
npm install
npm run dev
```

- App should run on `http://localhost:3000`


## Main API Endpoints

### Auth
- `POST /api/auth/register`
  - body: `{ username, email, password }`
  - responses: 200 success or 500

- `POST /api/auth/login`
  - body: `{ email, password }`
  - response: `{ token, user }` and user set `online`.

### Conversations
- `POST /api/conversation/create` (auth)
  - body: `{ receiverId }`
- `GET /api/conversation/all` (auth)
- `GET /api/conversation` (auth)

### Messages
- `POST /api/message/send` (auth)
  - body: `{ conversationId, text }`
- `GET /api/message/:conversationId` (auth)

### User list
- `GET /api/users` (auth)


## Socket.io events

Client connect:
```js
const socket = io('http://localhost:5000', { auth: { token } });
```

Events:
- `join_conversation` (conversationId)
- `send_message` ({ conversationId, text })
- `receive_message` (message)
- `online_users` (currently emitted on connect/disconnect; update needed to include list)


## How to test quickly (curl)

1. Register user
```bash
curl -X POST http://localhost:5000/api/auth/register -H "Content-Type: application/json" -d '{"username":"u1","email":"u1@test.com","password":"P@ssw0rd"}'
```
2. Login and get token
```bash
curl -X POST http://localhost:5000/api/auth/login -H "Content-Type: application/json" -d '{"email":"u1@test.com","password":"P@ssw0rd"}'
```
3. Create conversation
```bash
curl -X POST http://localhost:5000/api/conversation/create -H "Authorization: Bearer <token>" -H "Content-Type: application/json" -d '{"receiverId":"<userId>"}'
```
4. Send message
```bash
curl -X POST http://localhost:5000/api/message/send -H "Authorization: Bearer <token>" -H "Content-Type: application/json" -d '{"conversationId":"<convId>","text":"hello"}'
```


## Known issues & next work

1. auth validation missing (Joi / express-validator required)
2. JWT should have `expiresIn` and refresh logic.
3. Rate limiting and input sanitization missing.
4. Socket `online_users` has no payload currently.
5. `disconnect` sets offline per socket, not multi-tab user session.
6. Redis layer is not implemented though mentioned in the scope.


## Production readiness indicator

- not yet production-ready; requires security hardening, validations, and multi-session reconcilation.

