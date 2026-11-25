import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import { AUTH_COOKIE_NAME, getJwtSecret } from "../lib/auth.js";

let io;

const getAuthToken = (cookieHeader = "") => {
  const cookie = cookieHeader
    .split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${AUTH_COOKIE_NAME}=`));

  return cookie ? cookie.slice(AUTH_COOKIE_NAME.length + 1) : null;
};

export const initializeSocket = (httpServer) => {
  io = new Server(httpServer, {
    cors: {
      origin: process.env.FRONTEND_URL,
      credentials: true,
    },
  });

  io.use(async (socket, next) => {
    const token = getAuthToken(socket.handshake.headers.cookie);
    if (!token) return next(new Error("Authentication required."));

    let decoded;
    try {
      decoded = jwt.verify(token, getJwtSecret());
    } catch {
      return next(new Error("Invalid or expired session."));
    }

    if (
      typeof decoded !== "object" ||
      decoded === null ||
      typeof decoded.userId !== "string"
    ) {
      return next(new Error("Invalid or expired session."));
    }

    let user;
    try {
      user = await User.findById(decoded.userId).select("_id");
    } catch (error) {
      return next(error);
    }
    if (!user) return next(new Error("Invalid or expired session."));

    socket.userId = user._id.toString();
    return next();
  });

  io.on("connection", (socket) => {
    socket.join(`user:${socket.userId}`);
  });

  return io;
};

export const emitToUser = (userId, event, payload) => {
  if (!io) throw new Error("Socket server has not been initialized.");
  io.to(`user:${userId}`).emit(event, payload);
};
