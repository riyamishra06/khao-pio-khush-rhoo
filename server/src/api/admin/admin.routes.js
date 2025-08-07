import { Router } from "express";
import controller from "./admin.controller.js";
import { authMiddleware } from "../../middlewares/auth.middleware.js";
import { roleCheck } from "../../middlewares/role.middleware.js";

const router = Router();

// All admin routes require authentication and admin role
router.use(authMiddleware);
router.use(roleCheck(["admin"]));

// User management
router.get("/users", controller.getUsers);
router.get("/users/:id", controller.getUserById);
router.put("/users/:id", controller.updateUser);
router.delete("/users/:id", controller.deleteUser);

// Analytics and statistics
router.get("/stats/system", controller.getSystemStats);
router.get("/analytics/users", controller.getUserAnalytics);
router.get("/analytics/nutrition", controller.getNutritionAnalytics);
router.get("/analytics/foods", controller.getFoodAnalytics);

// Data export
router.get("/export/users", controller.exportUserData);

export default router;
