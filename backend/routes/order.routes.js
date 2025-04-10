import express from "express";
import {
  createOrder,
  acceptOrder,
  cancelOrder,
} from "../controllers/order.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

// Post methods
router.post("/createOrder", protectRoute, createOrder);

// Patch methods
router.patch("/:id/accept", protectRoute, acceptOrder);
router.patch("/:id/cancel", protectRoute, cancelOrder);

export default router;
