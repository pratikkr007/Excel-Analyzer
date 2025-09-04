import User from "../models/User.js";
import Upload from "../models/Upload.js";

// Get all users
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// Delete user
export const deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    await Upload.deleteMany({ user: req.params.id }); // also delete uploads
    res.json({ message: "User deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// Get user upload history (for charts)
export const getUserUploadHistory = async (req, res) => {
  try {
    const uploads = await Upload.find({ user: req.params.id }).sort({ createdAt: 1 });
    const history = uploads.map(u => ({
      date: u.createdAt,
      size: u.size
    }));
    res.json(history);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// Admin dashboard summary
export const getAdminSummary = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalUploads = await Upload.countDocuments();
    const totalStorage = await Upload.aggregate([
      { $group: { _id: null, total: { $sum: "$size" } } }
    ]);
    res.json({
      totalUsers,
      totalUploads,
      totalStorage: totalStorage[0]?.total || 0
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
