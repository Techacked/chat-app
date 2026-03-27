import express from "express";
import { auth } from "../middleware/authMiddleware.js";
import {
  sendMessage,
  getMessages
} from "../controllers/messageController.js";
import { validateSendMessage, validateConversationId } from "../middleware/validators.js";

const router = express.Router();

router.post("/send", auth, validateSendMessage, sendMessage);
router.get("/:conversationId", auth, validateConversationId, getMessages);

export default router;
