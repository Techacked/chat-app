import express from "express";
import { auth } from "../middleware/authMiddleware.js";
import { getAllUsers } from "../controllers/userController.js";

const router = express.Router();

router.get("/", auth, getAllUsers);

export default router;