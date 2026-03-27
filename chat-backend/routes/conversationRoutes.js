import express from "express";
import { auth } from "../middleware/authMiddleware.js";
import {
  createConversation,
  getUserConversations
} from "../controllers/conversationController.js";
import { validateCreateConversation } from "../middleware/validators.js";

const router = express.Router();

router.post("/create", auth, validateCreateConversation, createConversation);
router.get("/all", auth, getUserConversations);
router.get("/", auth, getUserConversations);

export default router;
