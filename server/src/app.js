const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();

// =================== ROUTES ===================
const authRoutes = require("./routes/auth.routes");
const orgRoutes = require("./routes/org.routes"); // Organization routes
const userRoutes = require("./routes/user.routes");
const projectRoutes = require("./routes/project.routes"); // Project Management routes

// =================== MIDDLEWARE ===================
// CORS
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Body parser
app.use(express.json());
app.use(cookieParser());

// =================== HEALTH CHECK ===================
app.get("/", (req, res) => {
  res.send("API is running");
});

app.get("/api/health", (req, res) => {
  res.json({
    status: "success",
    message: "Backend is connected 🚀",
  });
});

app.get("/api/test", (req, res) => {
  res.json({
    status: "success",
    message: "Backend is connected1111111111 🚀",
  });
});

// =================== ROUTE MIDDLEWARE ===================
app.use("/api/auth", authRoutes);
app.use("/api/org", orgRoutes);
app.use("/api/users", userRoutes);
app.use("/api/projects", projectRoutes); // <-- Added Project Management routes

// =================== MONGODB CONNECTION ===================
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

module.exports = app;
