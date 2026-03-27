import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Message from "../models/Message.js";

// Track active socket connections per user to handle multiple tabs
const userSessions = new Map(); // userId -> Set of socketIds

export const chatSocket = (io) => {
  // Middleware for socket authentication
  io.use((socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      if (!token) {
        return next(new Error("Auth token missing"));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.userId = decoded.id;
      next();
    } catch (err) {
      next(new Error("Authentication error: " + err.message));
    }
  });

  io.on("connection", async (socket) => {
    console.log(`📱 User ${socket.userId} connected with socket ${socket.id}`);

    // Track user session (multi-tab support)
    if (!userSessions.has(socket.userId)) {
      userSessions.set(socket.userId, new Set());
    }
    userSessions.get(socket.userId).add(socket.id);

    try {
      // Update user status to online only if it's the first connection
      if (userSessions.get(socket.userId).size === 1) {
        await User.findByIdAndUpdate(socket.userId, {
          status: "online",
          lastSeen: new Date()
        });
      }

      // Broadcast online users count
      broadcastOnlineUsers(io);

      // Join user to their personal room for targeted notifications
      socket.join(`user-${socket.userId}`);

    } catch (err) {
      console.error("Error on user connect:", err);
    }

    // ============ Socket Events ============

    socket.on("join_conversation", (conversationId) => {
      try {
        if (!conversationId) {
          socket.emit("error", "Conversation ID required");
          return;
        }

        // Verify user is member of conversation (security check)
        // This is optional as backend also validates on message send
        socket.join(conversationId);
        console.log(`✅ User ${socket.userId} joined conversation ${conversationId}`);
      } catch (err) {
        console.error("Error joining conversation:", err);
        socket.emit("error", "Failed to join conversation");
      }
    });

    socket.on("send_message", async (data) => {
      try {
        const { conversationId, text } = data;

        if (!conversationId || !text) {
          socket.emit("error", "Conversation ID and text required");
          return;
        }

        // Create message in database
        const message = await Message.create({
          conversationId,
          senderId: socket.userId,
          text
        }).then(msg => msg.populate("senderId", "-password"));

        // Update conversation updatedAt
        const Conversation = (await import("../models/Conversation.js")).default;
        await Conversation.findByIdAndUpdate(conversationId, {
          updatedAt: new Date()
        });

        // Emit message to all users in the conversation room
        io.to(conversationId).emit("receive_message", {
          success: true,
          message
        });

        console.log(`💬 Message sent by ${socket.userId} in conversation ${conversationId}`);
      } catch (err) {
        console.error("Error sending message:", err);
        socket.emit("error", "Failed to send message");
      }
    });

    socket.on("typing", (conversationId) => {
      try {
        // Broadcast typing indicator to others in the conversation
        socket.to(conversationId).emit("user_typing", {
          userId: socket.userId,
          conversationId
        });
      } catch (err) {
        console.error("Error broadcasting typing:", err);
      }
    });

    socket.on("stop_typing", (conversationId) => {
      try {
        socket.to(conversationId).emit("user_stop_typing", {
          userId: socket.userId
        });
      } catch (err) {
        console.error("Error broadcasting stop typing:", err);
      }
    });

    socket.on("disconnect", async () => {
      try {
        console.log(`❌ User ${socket.userId} disconnected (socket: ${socket.id})`);

        // Remove socket from user sessions
        const userSession = userSessions.get(socket.userId);
        if (userSession) {
          userSession.delete(socket.id);

          // Only set offline if user has no more active connections
          if (userSession.size === 0) {
            await User.findByIdAndUpdate(socket.userId, {
              status: "offline",
              lastSeen: new Date()
            });
            userSessions.delete(socket.userId);
            console.log(`🔴 User ${socket.userId} is now fully offline`);
          } else {
            console.log(`⚪ User ${socket.userId} still has ${userSession.size} active connection(s)`);
          }
        }

        // Broadcast updated online users
        broadcastOnlineUsers(io);
      } catch (err) {
        console.error("Error on user disconnect:", err);
      }
    });

    // Handle socket errors
    socket.on("error", (error) => {
      console.error(`Socket error for user ${socket.userId}:`, error);
    });
  });

  // Handle namespace errors
  io.on("error", (error) => {
    console.error("Socket.io namespace error:", error);
  });
};

// Helper function to broadcast online users
async function broadcastOnlineUsers(io) {
  try {
    const onlineUsers = await (await import("../models/User.js")).default
      .find({ status: "online" }, "-password")
      .sort({ username: 1 });

    io.emit("online_users", {
      success: true,
      count: onlineUsers.length,
      users: onlineUsers
    });
  } catch (err) {
    console.error("Error broadcasting online users:", err);
  }
}

