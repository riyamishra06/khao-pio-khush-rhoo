import { Schema, model } from "mongoose";
import jwt from "jsonwebtoken";
import config from "../config/app.config.js";

const adminSchema = new Schema({
  username: { type: String },
  email: { type: String, required: true },
  password: { type: String, required: true },
});

adminSchema.methods.generateToken = function () {
  const token = jwt.sign({ adminId: this._id }, config.jwt.secret);
  return token;
};

export const Madmin = model("admin", adminSchema);
