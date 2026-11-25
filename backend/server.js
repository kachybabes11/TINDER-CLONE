import dns from "node:dns"
import { pathToFileURL } from "node:url";
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors"
import "dotenv/config";

dns.setServers(["1.1.1.1", "8.8.8.8"])

import { connectDB } from "./config/db.js";
import authRoutes from "./routes/auth.route.js";
import matchRoutes from "./routes/match.route.js";
import messageRoutes from "./routes/message.route.js";
import userRoutes from "./routes/user.route.js";
import { getJwtSecret } from "./lib/auth.js";
import {initializeSocket} from "./socket/socket.js"
import { createServer } from "node:http";

const app = express();
const PORT = process.env.PORT || 5000;
const httpServer = createServer(app)

initializeSocket(httpServer)

app.use(cookieParser());
app.use(cors({
  origin:process.env.FRONTEND_URL,
  credentials: true
}))

app.put("/api/users/update", express.json({ limit: "10mb" }));
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/matches", matchRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/users", userRoutes);

app.use((error, _req, res, next) => {
  if (error?.type === "entity.too.large") {
    return res.status(413).json({
      message: "Request payload is too large. Choose a smaller profile image.",
    });
  }

  console.error("Unhandled request error:", error);
  if (res.headersSent) {
    return next(error);
  }
  return res.status(500).json({ message: "Internal server error." });
});

export const startServer = async () => {
  getJwtSecret();
  await connectDB();

  const server = httpServer.listen(PORT);
  await new Promise((resolve, reject) => {
    const handleError = (error) => {
      server.off("listening", handleListening);
      reject(error);
    };
    const handleListening = () => {
      server.off("error", handleError);
      resolve();
    };

    server.once("error", handleError);
    server.once("listening", handleListening);
  });

  console.log(`Server listening on port ${PORT}`);
  return server;
};

export { app };

if (
  process.argv[1] &&
  pathToFileURL(process.argv[1]).href === import.meta.url
) {
  startServer().catch((error) => {
    console.error("Server startup failed:", error);
    process.exitCode = 1;
  });
}