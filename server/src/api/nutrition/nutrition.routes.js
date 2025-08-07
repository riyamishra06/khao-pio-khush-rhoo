import { Router } from "express";
import controller from "./nutrition.controller.js";
import { authMiddleware } from "../../middlewares/auth.middleware.js";

const router = Router();

// All nutrition routes require authentication
router.use(authMiddleware);

// Nutrition entries CRUD
router.get("/", controller.getNutritionEntries);
router.post("/", controller.createNutritionEntry);
router.get("/:id", controller.getNutritionEntryById);
router.put("/:id", controller.updateNutritionEntry);
router.delete("/:id", controller.deleteNutritionEntry);

// Daily summary
router.get("/summary/daily", controller.getDailySummary);

// Reports and analytics
router.get("/reports", controller.getNutritionReports);
router.get("/charts", controller.getChartData);
router.get("/goals/progress", controller.getGoalsProgress);

// Nutrition statistics (coming soon)
router.get("/stats/overview", controller.getNutritionStats);

export default router;
