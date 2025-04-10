import express from "express";
import {
  createAdvert,
  getActiveAdverts,
  completeAdvert,
  cancelAdvert,
  progressAdvert,
} from "../controllers/advert.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

// Post Methods
router.post("/createAdvert", protectRoute, createAdvert);

// Get Methods
router.get("/getActiveAdverts", getActiveAdverts);

// Patch Methods
router.patch("/:id/complete", protectRoute, completeAdvert);
router.patch("/:id/cancel", protectRoute, cancelAdvert);
router.patch("/:id/progress", protectRoute, progressAdvert);

export default router;
