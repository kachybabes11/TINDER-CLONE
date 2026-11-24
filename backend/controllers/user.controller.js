import mongoose from "mongoose";
import User from "../models/user.model.js";
import cloudinary from "../config/cloudinary.js";

const publicUser = (user) => {
  const data = typeof user.toObject === "function" ? user.toObject() : { ...user };
  delete data.password;
  return data;
};

const isValidId = (id) =>
  typeof id === "string" && mongoose.Types.ObjectId.isValid(id);

export const updateProfile = async (req, res) => {
  const body = req.body && typeof req.body === "object" ? req.body : {};
  const allowedFields = ["name", "age", "gender", "interestedIn", "bio", "image"];
  const updates = {};

  for (const field of allowedFields) {
    if (Object.prototype.hasOwnProperty.call(body, field)) {
      updates[field] = body[field];
    }
  }

  if (Object.prototype.hasOwnProperty.call(updates, "name")) {
    updates.name =
      typeof updates.name === "string" ? updates.name.trim() : updates.name;
  }

  if (Object.prototype.hasOwnProperty.call(updates, "bio")) {
    updates.bio =
      typeof updates.bio === "string" ? updates.bio.trim() : updates.bio;
  }

  if (Object.prototype.hasOwnProperty.call(updates, "age")) {
    updates.age = Number(updates.age);
  }

  if (typeof updates.image === "string" && updates.image.startsWith("data:")) {
    try {
      const uploaded = await cloudinary.uploader.upload(updates.image, {
        folder: "tinder-clone",
      });
      updates.image = uploaded.secure_url;
    } catch (error) {
      console.error("Profile image upload failed:", error);
      return res.status(500).json({ message: "Unable to upload profile image." });
    }
  }

  try {
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $set: updates },
      { new: true, runValidators: true },
    );

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    return res.status(200).json({ user: publicUser(user) });
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      return res.status(400).json({ message: "Invalid profile details." });
    }

    console.error("Profile update failed:", error);
    return res.status(500).json({ message: "Unable to update profile." });
  }
};

export const getUserProfiles = async (req, res) => {
  try {
    const currentUser = req.user;
    const excludedIds = [
      currentUser._id,
      ...currentUser.likes,
      ...currentUser.dislikes,
    ];

    const genderFilter =
      currentUser.interestedIn === "Both"
        ? { gender: { $in: ["Male", "Female", "Other", "Prefer not to say"] } }
        : { gender: currentUser.interestedIn };

    const users = await User.find({
      _id: { $nin: excludedIds },
      ...genderFilter,
    }).select("-password");

    return res.status(200).json({ users });
  } catch (error) {
    console.error("Profile discovery failed:", error);
    return res.status(500).json({ message: "Unable to load profiles." });
  }
};

export const getUserById = async (req, res) => {
  const targetId = req.params.id;
  if (!isValidId(targetId)) {
    return res.status(400).json({ message: "Invalid user id." });
  }

  try {
    const isMatch = req.user.matches.some(
      (id) => id.toString() === targetId,
    );
    if (!isMatch) {
      return res.status(403).json({ message: "Profile is only available to matches." });
    }

    const targetUser = await User.findById(targetId);
    if (!targetUser) {
      return res.status(404).json({ message: "User not found." });
    }

    return res.status(200).json({ user: publicUser(targetUser) });
  } catch (error) {
    console.error("Loading matched profile failed:", error);
    return res.status(500).json({ message: "Unable to load user profile." });
  }
};