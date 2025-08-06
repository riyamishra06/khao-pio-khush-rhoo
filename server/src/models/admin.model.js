import { Schema, model } from "mongoose";
import jwt from "jsonwebtoken";
import config from "../config/app.config.js";

const AdminSchema = new Schema({
  username: { type: String },
  email: { type: String, required: true },
  password: { type: String, required: true },
});

AdminSchema.methods.generateToken = function () {
  const token = jwt.sign({ adminId: this._id }, config.jwt.secret);
  return token;
};

export const MAdmin = model("Admin", AdminSchema);
