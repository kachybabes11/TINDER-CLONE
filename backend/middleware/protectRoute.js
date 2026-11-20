import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import { AUTH_COOKIE_NAME, getJwtSecret } from "../lib/auth.js";

export const protectRoute = async (req, res, next) => {
  const token = req.cookies?.[AUTH_COOKIE_NAME];
  if (!token) {
    return res.status(401).json({ message: "Authentication required." });
  }

  let secret;
  try {
    secret = getJwtSecret();
  } catch (error) {
    return next(error);
  }

  let decoded;
  try {
    decoded = jwt.verify(token, secret);
  } catch {
    return res.status(401).json({ message: "Invalid or expired session." });
  }

  if (
    typeof decoded !== "object" ||
    decoded === null ||
    typeof decoded.userId !== "string"
  ) {
    return res.status(401).json({ message: "Invalid or expired session." });
  }

  try {
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(401).json({ message: "Invalid or expired session." });
    }

    req.user = user;
    return next();
  } catch (error) {
    return next(error);
  }
};