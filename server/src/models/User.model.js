const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      index: true
    },

    password: {
      type: String,
      required: true,
      select: false
    },

    role: {
      type: String,
      enum: ["admin", "manager", "employee"],
      default: "employee"
    },
    
    org_id: {
      type: Number,
      required: true,
      index: true
    },

    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active"
    },

    refreshToken: {
      type: String,
      select: false
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
