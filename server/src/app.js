const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

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

module.exports = app;
