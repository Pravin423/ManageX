const User = require("../models/User.model");

exports.getMe = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId)
      .populate("org_id", "name") // 👈 FETCH ORG NAME
      .select(
        "name email role org_id status createdAt"
      );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({
      name: user.name,
      email: user.email,
      role: user.role,
      org: {
        id: user.org_id._id,
        name: user.org_id.name
      }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
