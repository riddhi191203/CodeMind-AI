import express from "express";

import {
  forgotPassword,
  getProfile,
  googleOAuthPlaceholder,
  loginUser,
  registerUser,
  resetPassword,
  updateProfile,
} from "../controllers/authController.js";

import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/google", googleOAuthPlaceholder);
router.post("/forgot-password", forgotPassword);
router.put("/reset-password/:id", resetPassword);
router.get("/profile", protect, getProfile);
router.put("/profile", protect, updateProfile);

export default router;
