import { Router } from "express";
import {
  getUserById,
  getUserProfiles,
  updateProfile,
} from "../controllers/user.controller.js";
import { protectRoute } from "../middleware/protectRoute.js";

const router = Router();

router.put("/update", protectRoute, updateProfile);
router.get("/", protectRoute, getUserProfiles);
router.get("/:id", protectRoute, getUserById);

export default router;
