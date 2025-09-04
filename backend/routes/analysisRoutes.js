import express from "express";
import { protect } from "../middleware/auth.js";
import {
  uploadMiddleware,
  uploadAndParse,
  getMyAnalysis,
  getAnalysisById,
  deleteAnalysis
} from "../controllers/analysisController.js";

const router = express.Router();

router.post("/upload", protect, uploadMiddleware, uploadAndParse);
router.get("/", protect, getMyAnalysis);
router.get("/:id", protect, getAnalysisById);
router.delete("/:id", protect, deleteAnalysis);

export default router;
