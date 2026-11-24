import { Router } from "express";
import {
  dislikeUser,
  getMatches,
  likeUser,
  swipeLeft,
  swipeRight,
} from "../controllers/match.controller.js";
import { protectRoute } from "../middleware/protectRoute.js";

const router = Router();

router.get("/", protectRoute, getMatches);
router.post("/swipe-right/:id", protectRoute, swipeRight);
router.post("/swipe-left/:id", protectRoute, swipeLeft);
router.post("/like/:id", protectRoute, likeUser);
router.post("/dislike/:id", protectRoute, dislikeUser);

export default router;
