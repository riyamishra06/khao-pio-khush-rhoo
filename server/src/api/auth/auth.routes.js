import { Router } from "express";
import { login, verify } from "./auth.controller.js";

const router = Router();

router.post("/login", login);
router.post("/verify", verify);

export default router;
