import Conversation from "../models/Conversation.js";
import User from "../models/User.js";

export const createConversation = async (req, res, next) => {
  try {
    const { receiverId } = req.body;

    // Prevent self-conversation
    if (req.user._id.toString() === receiverId) {
      return res.status(400).json({
        success: false,
        message: "Cannot create conversation with yourself"
      });
    }

    // Verify receiver exists
    const receiver = await User.findById(receiverId);
    if (!receiver) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    // Check if conversation already exists
    const existing = await Conversation.findOne({
      members: { $all: [req.user._id, receiverId] }
    }).populate("members", "-password");

    if (existing) {
      return res.status(200).json({
        success: true,
        message: "Conversation already exists",
        conversation: existing
      });
    }

    // Create new conversation
    const conversation = await Conversation.create({
      members: [req.user._id, receiverId],
      createdAt: new Date()
    }).then(conv => conv.populate("members", "-password"));

    res.status(201).json({
      success: true,
      message: "Conversation created successfully",
      conversation
    });
  } catch (err) {
    next(err);
  }
};

export const getUserConversations = async (req, res, next) => {
  try {
    const conversations = await Conversation.find({
      members: { $in: [req.user._id] }
    })
      .populate("members", "-password")
      .sort({ updatedAt: -1 });

    res.status(200).json({
      success: true,
      count: conversations.length,
      conversations
    });
  } catch (err) {
    next(err);
  }
};
