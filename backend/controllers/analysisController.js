import multer from "multer";
import fs from "fs";
import path from "path";
import { parseExcelFromBuffer } from "../utils/parseExcel.js";
import Analysis from "../models/Analysis.js";

const UPLOAD_DIR = process.env.UPLOAD_DIR || "uploads";
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });

// Multer setup (store file temporarily in memory to parse)
const storage = multer.memoryStorage();
export const uploadMiddleware = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB
}).single("file");

export const uploadAndParse = async (req, res, next) => {
  try {
    // multer added file to req.file
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });
    const buffer = req.file.buffer;
    const parsed = parseExcelFromBuffer(buffer);
    // save file to disk (optional) for reference
    const fileName = `${Date.now()}_${req.file.originalname}`;
    const savePath = path.join(UPLOAD_DIR, fileName);
    fs.writeFileSync(savePath, buffer);

    // Create Analysis doc
    const analysis = await Analysis.create({
      user: req.user._id,
      originalFileName: req.file.originalname,
      uploadPath: savePath,
      parsedColumns: parsed.headers,
      dataPreview: parsed.data.slice(0, 100), // limit preview to 100 rows
      metadata: { rows: parsed.rows, cols: parsed.cols }
    });

    res.json({ analysis, parsed: { headers: parsed.headers, rows: parsed.rows } });
  } catch (err) {
    next(err);
  }
};

export const getMyAnalysis = async (req, res, next) => {
  try {
    const items = await Analysis.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(items);
  } catch (err) {
    next(err);
  }
};

export const getAnalysisById = async (req, res, next) => {
  try {
    const item = await Analysis.findById(req.params.id);
    if (!item) return res.status(404).json({ message: "Not found" });
    if (!item.user.equals(req.user._id) && req.user.role !== "admin") {
      return res.status(403).json({ message: "Forbidden" });
    }
    res.json(item);
  } catch (err) {
    next(err);
  }
};

export const deleteAnalysis = async (req, res, next) => {
  try {
    const item = await Analysis.findById(req.params.id);
    if (!item) return res.status(404).json({ message: "Not found" });
    if (!item.user.equals(req.user._id) && req.user.role !== "admin") {
      return res.status(403).json({ message: "Forbidden" });
    }
    // delete file if exists
    try { fs.unlinkSync(item.uploadPath); } catch (e) {}
    await item.remove();
    res.json({ message: "Deleted" });
  } catch (err) {
    next(err);
  }
};
