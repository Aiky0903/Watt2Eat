import express from "express";
import { createAdvert } from "../controllers/advert.controller.js";

const router = express.Router();

router.post("/createAdvert", createAdvert);

export default router;