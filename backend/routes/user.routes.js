import express from "express";
import multer from "multer";
const upload = multer();
import {
  registerUser,
  loginStatus,
  logoutUser,
  loginUser,
} from "../controllers/user.controller.js";

const router = express.Router();

router.get("/loginStatus", loginStatus);
router.get("/logout", logoutUser);
router.post("/register", upload.none(), registerUser);
router.post("/login", loginUser);

export default router;
