// src/models/Project.js
const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  startDate: Date,
  endDate: Date,
  manager: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  employees: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  org: { type: mongoose.Schema.Types.ObjectId, ref: "Organization", required: true },
  tasks: [
    {
      title: String,
      description: String,
      assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      status: { type: String, enum: ["todo", "in-progress", "done"], default: "todo" },
      dueDate: Date,
    },
  ],
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Project", projectSchema);
