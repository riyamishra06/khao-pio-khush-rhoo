import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { Schema, model } from "mongoose";
import config from "../config/app.config.js";

const UserSchema = new Schema(
  {
    username: { type: String, required: true },
    email:    { type: String, required: true, unique: true },
    password: { type: String, required: true },

    // ✅ Role field with default "user"
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
  },
  { timestamps: true }
);

// 🔐 Hash password before saving
UserSchema.pre("save", async function (next) {
  try {
    if (!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
  } catch (error) {
    next(error);
  }
});

// 🔐 Hash password before update (if modified)
UserSchema.pre("updateOne", async function (next) {
  try {
    const update = this.getUpdate();
    if (
      update &&
      typeof update === "object" &&
      "password" in update &&
      typeof update.password === "string"
    ) {
      const hashed = await bcrypt.hash(update.password, 10);
      this.setUpdate({ ...update, password: hashed });
    }
    next();
  } catch (error) {
    next(error);
  }
});

// 🔐 Compare input password with hashed
UserSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

// 🔐 Generate JWT
UserSchema.methods.generateToken = function () {
  return jwt.sign({ userId: this._id, role: this.role }, config.jwt.secret, {
    expiresIn: "7d",
  });
};

export const MUser = model("Users", UserSchema);
