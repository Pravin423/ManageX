const jwt = require("jsonwebtoken");

// 🔐 Authentication middleware
exports.authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // Check header format
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized: No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    req.user = decoded; // { id, role, org_id }
    next();
  } catch (err) {
    return res.status(403).json({ message: "Invalid or expired token" });
  }
};

// 🛡️ Role-based access control middleware
exports.roleMiddleware = (allowedRoles = []) => {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res
        .status(403)
        .json({ message: "Forbidden: Insufficient role" });
    }
    next();
  };
};
