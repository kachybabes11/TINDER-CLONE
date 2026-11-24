import { Router } from "express";
import {
  getMe,
  logout,
  signin,
  signup,
} from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/protectRoute.js";

const router = Router();

router.post("/signup", signup);
router.post("/signin", signin);
router.post("/logout", logout);
router.get("/me", protectRoute, getMe);

export default router;