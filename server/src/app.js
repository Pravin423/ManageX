const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const app = express();
const authRoutes = require("./routes/auth.routes");


app.use(cors());
app.use(express.json());
app.use(cookieParser());

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
app.use("/api/auth", authRoutes);

module.exports = app;
