const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const app = express();

// Routes
const authRoutes = require("./routes/auth.routes");
const orgRoutes = require("./routes/org.routes"); // Organization routes

// CORS
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"]
  })
);

// Body parser
app.use(express.json());
app.use(cookieParser());

// Health check routes
app.get("/", (req, res) => {
  res.send("API is running");
});

app.get("/api/health", (req, res) => {
  res.json({
    status: "success",
    message: "Backend is connected 🚀"
  });
});

app.get("/api/test", (req, res) => {
  res.json({
    status: "success",
    message: "Backend is connected1111111111 🚀"
  });
});

// Route middlewares
app.use("/api/auth", authRoutes);
app.use("/api/org", orgRoutes); // <-- THIS LINE WAS MISSING

module.exports = app;
