import { Router } from "express";
import {
  getMessages,
  sendMessage,
} from "../controllers/message.controller.js";
import { protectRoute } from "../middleware/protectRoute.js";

const router = Router();

router.get("/:userId", protectRoute, getMessages);
router.post("/:userId", protectRoute, sendMessage);

export default router;