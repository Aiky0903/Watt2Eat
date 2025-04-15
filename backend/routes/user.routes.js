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
router.get("/logoutUser", logoutUser);
router.post("/registerUser", upload.none(), registerUser);
router.post("/loginUser", loginUser);

export default router;
