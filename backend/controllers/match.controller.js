import mongoose from "mongoose";
import User from "../models/user.model.js";

const isValidId = (id) =>
  typeof id === "string" && mongoose.Types.ObjectId.isValid(id);

export const getMatches = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate(
      "matches",
      "name image age bio",
    );

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    return res.status(200).json({ matches: user.matches });
  } catch (error) {
    console.error("Loading matches failed:", error);
    return res.status(500).json({ message: "Unable to load matches." });
  }
};

export const swipeRight = async (req, res) => {
  const targetId = req.params.id;
  if (!isValidId(targetId)) {
    return res.status(400).json({ message: "Invalid user id." });
  }
  if (targetId === req.user._id.toString()) {
    return res.status(400).json({ message: "You cannot like yourself." });
  }

  try {
    const targetUser = await User.findById(targetId);
    if (!targetUser) {
      return res.status(404).json({ message: "User not found." });
    }

    await User.findByIdAndUpdate(req.user._id, {
      $addToSet: { likes: targetUser._id },
      $pull: { dislikes: targetUser._id },
    });

    const reciprocalLike = targetUser.likes.some(
      (id) => id.toString() === req.user._id.toString(),
    );

    if (reciprocalLike) {
      await Promise.all([
        User.findByIdAndUpdate(req.user._id, {
          $addToSet: { matches: targetUser._id },
        }),
        User.findByIdAndUpdate(targetUser._id, {
          $addToSet: { matches: req.user._id },
        }),
      ]);
    }

    return res.status(200).json({
      matched: reciprocalLike,
      message: reciprocalLike ? "You matched!" : "Like recorded.",
    });
  } catch (error) {
    console.error("Swipe right failed:", error);
    return res.status(500).json({ message: "Unable to like user." });
  }
};

export const swipeLeft = async (req, res) => {
  const targetId = req.params.id;
  if (!isValidId(targetId)) {
    return res.status(400).json({ message: "Invalid user id." });
  }
  if (targetId === req.user._id.toString()) {
    return res.status(400).json({ message: "You cannot dislike yourself." });
  }

  try {
    const targetUser = await User.findById(targetId);
    if (!targetUser) {
      return res.status(404).json({ message: "User not found." });
    }

    await User.findByIdAndUpdate(req.user._id, {
      $addToSet: { dislikes: targetUser._id },
      $pull: { likes: targetUser._id, matches: targetUser._id },
    });
    await User.findByIdAndUpdate(targetUser._id, {
      $pull: { matches: req.user._id },
    });

    return res.status(200).json({ message: "Dislike recorded." });
  } catch (error) {
    console.error("Swipe left failed:", error);
    return res.status(500).json({ message: "Unable to dislike user." });
  }
};

export const likeUser = swipeRight;
export const dislikeUser = swipeLeft;