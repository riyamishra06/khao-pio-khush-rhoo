import { Router } from "express";
import { login, verify, adminRegister, userRegister } from "./auth.controller.js";
import { authMiddleware } from "../../middlewares/auth.middleware.js";

const router = Router();

// Public routes
router.post("/login", login);
router.post("/register/user", userRegister);
router.post("/register/admin", adminRegister); // For initial setup

// Protected routes
router.post("/verify", authMiddleware, verify);

export default router;
