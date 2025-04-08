import express from "express";
import { createOrder, acceptOrder } from "../controllers/order.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();
router.post("/createOrder", protectRoute, createOrder);
router.patch("/:id/accept", protectRoute, acceptOrder);

export default router;
