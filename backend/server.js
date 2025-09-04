import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import analysisRoutes from "./routes/analysisRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import errorHandler from "./middleware/errorHandler.js";

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// connect DB
connectDB();

// static uploads (optional)
app.use("/uploads", express.static(path.join(__dirname, process.env.UPLOAD_DIR || "uploads")));

// routes
app.use("/api/auth", authRoutes);
app.use("/api/analysis", analysisRoutes);
app.use("/api/admin", adminRoutes);

// error handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port http://localhost:${PORT}`));
