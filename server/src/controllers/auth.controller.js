const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User.model");
const {
  generateAccessToken,
  generateRefreshToken
} = require("../utils/token");

/**
 * Register a new user
 */
exports.register = async (req, res) => {
  try {
    const { name, email, password, org_id ,role } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await User.create({
      name,
      email,
      org_id,
      role,
      password: hashedPassword
    });

    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * Login user
 */
exports.login = async (req, res) => {
  try {
    const { email, password, org_id } = req.body;

    // Include org_id if provided
    const query = org_id ? { email, org_id } : { email };
    const user = await User.findOne(query).select("+password +refreshToken");

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    if (user.status !== "active") {
      return res.status(403).json({ message: "Account inactive" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    // Store refresh token in DB
    user.refreshToken = refreshToken;
    await user.save();

    // Send refresh token as HTTP-only cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // use HTTPS in production
      sameSite: "Strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.json({
      accessToken,
      role: user.role
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * Refresh access token
 */
exports.refresh = (req, res) => {
  try {
    const token = req.cookies.refreshToken; // now req.cookies works
    if (!token) return res.status(401).json({ message: "No refresh token" });

    jwt.verify(token, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
      if (err) return res.status(403).json({ message: "Invalid refresh token" });
      const accessToken = generateAccessToken(user);
      res.json({ accessToken });
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * Logout user
 */
exports.logout = async (req, res) => {
  try {
    const token = req.cookies.refreshToken;

    if (token) {
      const user = await User.findOne({ refreshToken: token });
      if (user) {
        user.refreshToken = null;
        await user.save();
      }
    }

    res.clearCookie("refreshToken");
    res.json({ message: "Logged out successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
