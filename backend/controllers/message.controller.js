import mongoose from "mongoose";
import Message from "../models/message.model.js";
import User from "../models/user.model.js";
import { emitToUser } from "../socket/socket.js";

const isValidId = (id) =>
  typeof id === "string" && mongoose.Types.ObjectId.isValid(id);

const getMatchedUser = async (currentUser, targetId) => {
  if (!isValidId(targetId)) {
    return { error: { status: 400, message: "Invalid user id." } };
  }
  if (targetId === currentUser._id.toString()) {
    return { error: { status: 400, message: "You cannot message yourself." } };
  }

  const targetUser = await User.findById(targetId).select("matches");
  if (!targetUser) {
    return { error: { status: 404, message: "User not found." } };
  }

  const currentUserMatchesTarget = currentUser.matches.some(
    (id) => id.toString() === targetId,
  );
  const targetUserMatchesCurrent = targetUser.matches.some(
    (id) => id.toString() === currentUser._id.toString(),
  );

  if (!currentUserMatchesTarget || !targetUserMatchesCurrent) {
    return { error: { status: 403, message: "Messaging is only available to matches." } };
  }

  return { targetUser };
};

export const getMessages = async (req, res) => {
  try {
    const result = await getMatchedUser(req.user, req.params.userId);
    if (result.error) {
      return res.status(result.error.status).json({ message: result.error.message });
    }

    const messages = await Message.find({
      $or: [
        { sender: req.user._id, receiver: result.targetUser._id },
        { sender: result.targetUser._id, receiver: req.user._id },
      ],
    }).sort({ createdAt: 1 });

    return res.status(200).json({ messages });
  } catch (error) {
    console.error("Loading messages failed:", error);
    return res.status(500).json({ message: "Unable to load messages." });
  }
};

export const sendMessage = async (req, res) => {
  const text =
    req.body && typeof req.body.text === "string" ? req.body.text.trim() : "";
  if (!text || text.length > 2000) {
    return res.status(400).json({
      message: "Message text is required and must be 2000 characters or fewer.",
    });
  }

  try {
    const result = await getMatchedUser(req.user, req.params.userId);
    if (result.error) {
      return res.status(result.error.status).json({ message: result.error.message });
    }

    const message = await Message.create({
      sender: req.user._id,
      receiver: result.targetUser._id,
      text,
    });

    const messageData = message.toObject();
    emitToUser(result.targetUser._id, "newMessage", messageData);
    emitToUser(req.user._id, "newMessage", messageData);

    return res.status(201).json({ message });
  } catch (error) {
    console.error("Sending message failed:", error);
    return res.status(500).json({ message: "Unable to send message." });
  }
};