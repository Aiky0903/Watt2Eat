import express from "express";
import { createOrder, acceptOrder } from "../controllers/order.controller.js";

const router = express.Router();
router.post("/createOrder", createOrder);
router.patch("/:id/accept", acceptOrder);

export default router;
