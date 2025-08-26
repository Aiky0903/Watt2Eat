import express from "express";
import { createRestaurant, getRestaurants } from "../controllers/restaurant.controller.js";

const router = express.Router();
router.post("/createRestaurant", createRestaurant);
router.get("/", getRestaurants);
router.get()

export default router;