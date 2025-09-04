import express from "express";
import { protect } from "../middleware/auth.js"; // only import protect

// If you don’t want role-based admin check yet, comment this out
// import { adminMiddleware } from "../middleware/adminMiddleware.js";

import {
  getAllUsers,
  deleteUser,
  getUserUploadHistory,
  getAdminSummary
} from "../controllers/adminController.js";

const router = express.Router();

// Admin routes (currently only protected by JWT, not role-based)
router.get("/users", protect, getAllUsers);
router.delete("/users/:id", protect, deleteUser);
router.get("/users/:id/history", protect, getUserUploadHistory);
router.get("/summary", protect, getAdminSummary);

export default router;
