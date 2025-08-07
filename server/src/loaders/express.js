import express from "express";
import { join, dirname } from "path";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import cors from "cors";

import { roleCheck } from "../middlewares/role.middleware.js";

import authRouters from "../api/auth/auth.routes.js";
import userRouters from "../api/user/user.routes.js";
import foodRouters from "../api/foods/foods.routes.js";
import nutritionRouters from "../api/nutrition/nutrition.routes.js";
import adminRouters from "../api/admin/admin.routes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default async function expressLoader() {
  const app = express();
  const defaultHtml = readFileSync(
    join(__dirname, "../views/default.html"),
    "utf-8"
  );

  /** @Middleware */
  app.use(cors());
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ extended: true }));

  app.get("/", (req, res) => {
    res.status(200).send(defaultHtml);
  });

  /** @Routes */
    app.use("/api/auth", authRouters);
    app.use("/api/users", userRouters);
    app.use("/api/foods", foodRouters);
    app.use("/api/nutrition", nutritionRouters);
    app.use("/api/admin", adminRouters);

  return app;
}
