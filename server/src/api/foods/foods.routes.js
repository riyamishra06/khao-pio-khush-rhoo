import { Router } from "express";
import controller from "./foods.controller.js";
import { authMiddleware } from "../../middlewares/auth.middleware.js";
import { roleCheck } from "../../middlewares/role.middleware.js";

const router = Router();

// Public routes (no authentication required)
router.get("/search", controller.searchFoods);
router.get("/popular", controller.getPopularFoods);
router.get("/categories", controller.getFoodCategories);
router.get("/:id", controller.getFoodById);

// Protected routes (authentication required)
router.use(authMiddleware);

// User routes (authenticated users can view all foods)
router.get("/", controller.getFoods);

// Admin only routes
router.post("/", roleCheck(["admin"]), controller.createFood);
router.put("/:id", roleCheck(["admin"]), controller.updateFood);
router.delete("/:id", roleCheck(["admin"]), controller.deleteFood);
router.patch("/:id/verify", roleCheck(["admin"]), controller.verifyFood);

export default router;
