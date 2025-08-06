import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { Schema, model } from "mongoose";
import config from "../config/app.config.js";

const UserSchema = new Schema(
  {
    username: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
  },
  { timestamps: true }
);

UserSchema.pre("save", async function (next) {
  try {
    if (!this.isModified("password")) {
      return next();
    }
    this.password = await bcrypt.hash(this.password, 10);
    next();
  } catch (error) {
    next(error);
  }
});

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

UserSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

UserSchema.methods.generateToken = function () {
  const token = jwt.sign({ userId: this._id }, config.jwt.secret);
  return token;
};

export const MUser = model("Users", UserSchema);
