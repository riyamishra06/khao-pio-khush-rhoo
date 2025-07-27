import mongoose from "mongoose";
import config from "../config/app.config.js";

export default async function mongooseLoader() {
  const url = config.db.url;
  mongoose.connect(url).then(() => {
    console.log("Connected to MongoDB");
  });
}
