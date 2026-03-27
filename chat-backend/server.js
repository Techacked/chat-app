import express from "express";
import http from "http";
import { Server } from "socket.io";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import connectDB from "./config/db.js";

import authRoutes from "./routes/authRoutes.js";
import conversationRoutes from "./routes/conversationRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import { chatSocket } from "./sockets/chatSocket.js";
import { generalLimiter } from "./middleware/rateLimiter.js";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler.js";

dotenv.config();

// ============ Environment Variable Validation ============
const requiredEnvVars = ['MONGO_URI', 'JWT_SECRET'];
const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingVars.length > 0) {
  console.error('❌ Missing required environment variables:', missingVars.join(', '));
  console.error('Please set these in your deployment platform or .env file');
  process.exit(1);
}

const app = express();

// ============ Security & Logging ============
app.use(helmet()); // Set security HTTP headers
app.use(morgan("combined")); // Request logging
app.use(generalLimiter); // Apply general rate limiter to all routes

// ============ CORS Configuration ============
const corsOptions = {
  origin: process.env.FRONTEND_URL || "http://localhost:3000",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
};
app.use(cors(corsOptions));

// ============ Body Parsing ============
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

// ============ Database Connection ============
connectDB();

// ============ Health Check Route ============
app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Server is running",
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// ============ Root Route ============
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Chat App Backend API",
    version: "1.0.0",
    endpoints: {
      health: "GET /health",
      auth: {
        register: "POST /api/auth/register",
        login: "POST /api/auth/login"
      },
      conversations: {
        create: "POST /api/conversation/create",
        getAll: "GET /api/conversation/all"
      },
      messages: {
        send: "POST /api/message/send",
        get: "GET /api/message/:conversationId"
      },
      users: {
        getAll: "GET /api/users"
      }
    },
    docs: "See API_REFERENCE.md for detailed documentation"
  });
});

// ============ API Routes ============
app.use("/api/auth", authRoutes);
app.use("/api/conversation", conversationRoutes);
app.use("/api/message", messageRoutes);
app.use("/api/users", userRoutes);

// ============ Socket.io Server ============
const server = http.createServer(app);
const io = new Server(server, {
  cors: corsOptions,
  reconnection: true,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
  reconnectionAttempts: 5
});

chatSocket(io);

// ============ Error Handling ============
// 404 handler (must be after all routes)
app.use(notFoundHandler);
// Global error handler (must be last)
app.use(errorHandler);

// ============ Server Startup ============
const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || "development";

server.listen(PORT, () => {
  console.log(`\n✅ Server running on ${PORT}`);
  console.log(`📱 Environment: ${NODE_ENV}`);
  console.log(`🔗 CORS Origin: ${corsOptions.origin}`);
  console.log(`⏰ Started at: ${new Date().toISOString()}\n`);
});

// Graceful shutdown
process.on("SIGTERM", () => {
  console.log("\n🛑 SIGTERM received, shutting down gracefully...");
  server.close(() => {
    console.log("✅ Server closed");
    process.exit(0);
  });
});

export default app;
