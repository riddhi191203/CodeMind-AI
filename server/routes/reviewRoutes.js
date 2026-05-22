import express from "express";

import {
  analyzeComplexity,
  compareReviews,
  deleteReview,
  downloadReview,
  formatCode,
  getReviewById,
  getReviewHistory,
  getSupportedLanguages,
  refactorCode,
  reviewCode,
  solveError,
} from "../controllers/reviewController.js";

import upload from "../middleware/uploadMiddleware.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/languages", getSupportedLanguages);

router.post("/analyze", protect, upload.single("file"), reviewCode);
router.post("/error-solver", protect, upload.single("file"), solveError);
router.post("/refactor", protect, upload.single("file"), refactorCode);
router.post("/complexity", protect, upload.single("file"), analyzeComplexity);
router.post("/format", protect, upload.single("file"), formatCode);

router.get("/history", protect, getReviewHistory);
router.post("/compare", protect, compareReviews);
router.get("/:id/download", protect, downloadReview);
router.get("/:id", protect, getReviewById);
router.delete("/:id", protect, deleteReview);

export default router;
