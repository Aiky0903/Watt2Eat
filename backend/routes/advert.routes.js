import express from "express";
import { createAdvert } from "../controllers/advert.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/createAdvert", protectRoute, createAdvert);

export default router;
