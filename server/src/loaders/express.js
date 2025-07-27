import express from "express";
import { join, dirname } from "path";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import cors from "cors";

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

  return app;
}
