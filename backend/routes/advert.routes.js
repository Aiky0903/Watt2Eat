import express from "express";
import {
  createAdvert,
  getActiveAdverts,
  completeAdvert,
  cancelAdvert,
  progressAdvert,
  deleteAdvert,
  getAdvertById
} from "../controllers/advert.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

// Post Methods
router.post("/createAdvert", protectRoute, createAdvert);

// Get Methods
router.get("/getActiveAdverts", getActiveAdverts);
router.get("/:id", getAdvertById);

// Patch Methods
router.patch("/:id/complete", protectRoute, completeAdvert);
router.patch("/:id/cancel", protectRoute, cancelAdvert);
router.patch("/:id/progress", protectRoute, progressAdvert);

// Delete Methods
router.delete("/:id/delete", protectRoute, deleteAdvert);

export default router;
