import Message from "../models/Message.js";
import Conversation from "../models/Conversation.js";

export const sendMessage = async (req, res, next) => {
  try {
    const { conversationId, text } = req.body;

    // Verify conversation exists and user is a member
    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: "Conversation not found"
      });
    }

    const isMember = conversation.members.some(
      member => member.toString() === req.user._id.toString()
    );
    if (!isMember) {
      return res.status(403).json({
        success: false,
        message: "You are not a member of this conversation"
      });
    }

    // Create message
    const message = await Message.create({
      conversationId,
      senderId: req.user._id,
      text
    }).then(msg => msg.populate("senderId", "-password"));

    // Update conversation updatedAt
    await Conversation.findByIdAndUpdate(conversationId, {
      updatedAt: new Date()
    });

    res.status(201).json({
      success: true,
      message: "Message sent successfully",
      data: message
    });
  } catch (err) {
    next(err);
  }
};

export const getMessages = async (req, res, next) => {
  try {
    const { conversationId } = req.params;

    // Verify conversation exists and user is a member
    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: "Conversation not found"
      });
    }

    const isMember = conversation.members.some(
      member => member.toString() === req.user._id.toString()
    );
    if (!isMember) {
      return res.status(403).json({
        success: false,
        message: "You are not a member of this conversation"
      });
    }

    // Get messages with pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const skip = (page - 1) * limit;

    const messages = await Message.find({ conversationId })
      .populate("senderId", "-password")
      .sort({ createdAt: 1 })
      .skip(skip)
      .limit(limit);

    const total = await Message.countDocuments({ conversationId });

    res.status(200).json({
      success: true,
      count: messages.length,
      total,
      page,
      pages: Math.ceil(total / limit),
      messages
    });
  } catch (err) {
    next(err);
  }
};
