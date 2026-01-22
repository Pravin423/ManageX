// src/routes/project.routes.js
const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();

const Project = require("../models/Project");
const { authMiddleware, roleMiddleware } = require("../middleware/auth.middleware");

// ================= CREATE PROJECT =================
router.post(
  "/",
  authMiddleware,
  roleMiddleware(["admin", "manager"]),
  async (req, res) => {
    try {
      console.log("🔹 CREATE PROJECT REQUEST");
      console.log("User:", req.user);
      console.log("Body:", req.body);

      const { name, description, managerId, employees } = req.body;
      const orgId = req.user.org_id;

      if (!name) {
        return res.status(400).json({ message: "Project name is required" });
      }

      // Resolve manager ID safely
      let assignedManager;
      if (req.user.role === "manager") {
        assignedManager = req.user.id || req.user._id;
      } else {
        assignedManager = managerId;
      }

      if (!assignedManager || !mongoose.Types.ObjectId.isValid(assignedManager)) {
        return res.status(400).json({ message: "Invalid manager ID" });
      }

      // Validate employees array
      let validEmployees = [];
      if (Array.isArray(employees)) {
        validEmployees = employees.filter((id) =>
          mongoose.Types.ObjectId.isValid(id)
        );
      }

      const project = await Project.create({
        name,
        description,
        manager: assignedManager,
        employees: validEmployees,
        org: orgId,
      });

      console.log("✅ PROJECT CREATED:", project._id);

      res.status(201).json(project);
    } catch (err) {
      console.error("❌ CREATE PROJECT ERROR:", err);
      res.status(500).json({ message: err.message });
    }
  }
);



// ================= GET PROJECTS =================
router.get("/", authMiddleware, async (req, res) => {
  try {
    console.log("🔹 GET PROJECTS");
    console.log("User:", req.user);

    const userId = req.user.id || req.user._id;
    let query = { org: req.user.org_id };
    if (req.user.role === "manager") {
      query.manager = userId;
    } else if (req.user.role === "employee") {
      query.employees = userId;
    }
    // admin → filter by org only
    const projects = await Project.find(query)
      .populate("manager", "name email role")
      .populate("employees", "name email role")
      .populate("tasks.assignedTo", "name email");

    console.log(`✅ Found ${projects.length} projects`);

    res.json(projects);
  } catch (err) {
    console.error("❌ GET PROJECTS ERROR:", err);
    res.status(500).json({ message: err.message });
  }
});



// ================= UPDATE PROJECT =================
router.put(
  "/:id",
  authMiddleware,
  roleMiddleware(["admin", "manager"]),
  async (req, res) => {
    try {
      const project = await Project.findById(req.params.id);

      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }

      const userId = req.user.id || req.user._id;

      if (
        req.user.role === "manager" &&
        project.manager.toString() !== userId
      ) {
        return res.status(403).json({ message: "Not your project" });
      }

      const { name, description, employees, tasks } = req.body;

      if (name) project.name = name;
      if (description) project.description = description;

      if (Array.isArray(employees)) {
        project.employees = employees.filter((id) =>
          mongoose.Types.ObjectId.isValid(id)
        );
      }

      if (Array.isArray(tasks)) {
        project.tasks = tasks;
      }

      await project.save();

      res.json(project);
    } catch (err) {
      console.error("❌ UPDATE PROJECT ERROR:", err);
      res.status(500).json({ message: err.message });
    }
  }
);



// ================= DELETE PROJECT =================
router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware(["admin"]),
  async (req, res) => {
    try {
      const project = await Project.findByIdAndDelete(req.params.id);

      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }

      res.json({ message: "Project deleted successfully" });
    } catch (err) {
      console.error("❌ DELETE PROJECT ERROR:", err);
      res.status(500).json({ message: err.message });
    }
  }
);

module.exports = router;
