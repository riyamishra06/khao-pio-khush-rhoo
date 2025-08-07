import { Schema, model } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import config from "../config/app.config.js";

const adminSchema = new Schema({
  username: {
    type: String,
    required: true,
    trim: true,
    minlength: 3
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 8
  },
  role: {
    type: String,
    default: "admin",
    enum: ["admin", "super_admin"]
  },
  permissions: [{
    type: String,
    enum: [
      "manage_users",
      "manage_foods",
      "view_analytics",
      "manage_system",
      "export_data"
    ]
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: {
    type: Date
  }
}, { timestamps: true });

// Hash password before saving
adminSchema.pre("save", async function (next) {
  try {
    if (!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
adminSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

adminSchema.methods.generateToken = function () {
  const token = jwt.sign({
    adminId: this._id,
    role: this.role,
    permissions: this.permissions
  }, config.jwt.secret, {
    expiresIn: "24h"
  });
  return token;
};

// Update last login
adminSchema.methods.updateLastLogin = function () {
  this.lastLogin = new Date();
  return this.save();
};

export const Madmin = model("admin", adminSchema);
