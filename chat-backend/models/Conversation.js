import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema({
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  updatedAt: { type: Date, default: Date.now }
});

export default mongoose.model("Conversation", conversationSchema);
