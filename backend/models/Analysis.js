import mongoose from "mongoose";

const analysisSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: false },
  originalFileName: String,
  uploadPath: String,
  parsedColumns: [String], // header list
  dataPreview: { type: Array, default: [] }, // small sample or entire parsed JSON if small
  metadata: {
    rows: Number,
    cols: Number
  },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Analysis", analysisSchema);
