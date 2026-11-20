import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import User from "../models/user.model.js";
import {
  AUTH_COOKIE_NAME,
  getAuthCookieOptions,
  getJwtSecret,
} from "../lib/auth.js";

const createToken = (userId) =>
  jwt.sign({ userId: userId.toString() }, getJwtSecret(), {
    expiresIn: "7d",
  });

const publicUser = (user) => {
  const { password, ...userData } = user.toObject();
  return userData;
};

const setAuthCookie = (res, user) => {
  res.cookie(AUTH_COOKIE_NAME, createToken(user._id), getAuthCookieOptions());
};

export const signup = async (req, res) => {
  const body = req.body && typeof req.body === "object" ? req.body : {};
  const { name, email, password, age, gender, interestedIn } = body;
  const normalizedName = typeof name === "string" ? name.trim() : "";
  const normalizedEmail =
    typeof email === "string" ? email.trim().toLowerCase() : "";
  const parsedAge = Number(age);

  if (
    !normalizedName ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail) ||
    typeof password !== "string" ||
    !password ||
    !Number.isFinite(parsedAge) ||
    !Number.isInteger(parsedAge) ||
    parsedAge < 18 ||
    typeof gender !== "string" ||
    typeof interestedIn !== "string"
  ) {
    return res.status(400).json({ message: "Invalid signup details." });
  }

  try {
    const user = await User.create({
      name: normalizedName,
      email: normalizedEmail,
      password,
      age: parsedAge,
      gender,
      interestedIn,
    });

    setAuthCookie(res, user);
    return res.status(201).json({ user: publicUser(user) });
  } catch (error) {
    if (error?.code === 11000) {
      return res
        .status(409)
        .json({ message: "An account with this email already exists." });
    }

    if (error instanceof mongoose.Error.ValidationError) {
      return res.status(400).json({ message: "Invalid signup details." });
    }

    console.error("Signup failed:", error);
    return res.status(500).json({ message: "Unable to create account." });
  }
};

export const signin = async (req, res) => {
  const body = req.body && typeof req.body === "object" ? req.body : {};
  const email =
    typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  const { password } = body;

  if (!email || typeof password !== "string" || !password) {
    return res.status(400).json({ message: "Email and password are required." });
  }

  try {
    const user = await User.findOne({ email }).select("+password");
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    setAuthCookie(res, user);
    return res.status(200).json({ user: publicUser(user) });
  } catch (error) {
    console.error("Signin failed:", error);
    return res.status(500).json({ message: "Unable to sign in." });
  }
};

export const logout = (_req, res) => {
  const cookieOptions = getAuthCookieOptions();
  delete cookieOptions.maxAge;
  res.clearCookie(AUTH_COOKIE_NAME, cookieOptions);
  return res.status(200).json({ message: "Logged out successfully." });
};

export const getMe = (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: "Authentication required." });
  }

  return res.status(200).json({ user: publicUser(req.user) });
};
