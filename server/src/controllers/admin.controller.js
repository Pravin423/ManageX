import User from "../models/User.model.js";

/**
 * Get all users of the admin's organization
 */
export async function getOrgUsers(req, res) {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    const users = await User.find({ org_id: req.user.org_id }).select("-password -refreshToken");
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

/**
 * Approve a pending user
 */
export async function approveUser(req, res) {
  try {
    if (req.user.role !== "admin") return res.status(403).json({ message: "Access denied" });

    const user = await User.findOne({ _id: req.params.userId, org_id: req.user.org_id });
    if (!user) return res.status(404).json({ message: "User not found" });
    if (user.status === "active") return res.status(400).json({ message: "User already active" });

    user.status = "active";
    await user.save();
    res.status(200).json({ message: "User approved successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

/**
 * Block a user
 */
export async function blockUser(req, res) {
  try {
    if (req.user.role !== "admin") return res.status(403).json({ message: "Access denied" });

    const user = await User.findOne({ _id: req.params.userId, org_id: req.user.org_id });
    if (!user) return res.status(404).json({ message: "User not found" });
    if (user.role === "admin") return res.status(400).json({ message: "Cannot block admin user" });

    user.status = "blocked";
    await user.save();
    res.status(200).json({ message: "User blocked successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

/**
 * Reactivate a blocked user
 */
export async function reactivateUser(req, res) {
  try {
    if (req.user.role !== "admin") return res.status(403).json({ message: "Access denied" });

    const user = await User.findOne({ _id: req.params.userId, org_id: req.user.org_id });
    if (!user) return res.status(404).json({ message: "User not found" });

    user.status = "active";
    await user.save();
    res.status(200).json({ message: "User reactivated successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}
