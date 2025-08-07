import foodService from "./foods.service.js";
import httpCode from "http-status-codes";
import { 
  foodZodSchema, 
  updateFoodZodSchema,
  foodQueryZodSchema,
  foodVerificationZodSchema 
} from "./foods.validator.js";
import { zodError } from "../../utils/zodErrorFormat.js";

// Create new food item (Admin only)
const createFood = async (req, res) => {
  const result = foodZodSchema.safeParse(req.body);

  if (!result.success) {
    const formattedErrors = zodError(result.error.issues);
    return res.status(httpCode.BAD_REQUEST).send({ error: formattedErrors });
  }

  try {
    const adminId = req.user?.userId || req.user?.adminId;
    if (!adminId) {
      return res.status(httpCode.UNAUTHORIZED).send({ error: "Admin not authenticated" });
    }

    const food = await foodService.createFood(adminId, result.data);
    return res.status(httpCode.CREATED).send(food);
  } catch (error) {
    return res.status(httpCode.BAD_REQUEST).send({ error: error.message });
  }
};

// Get all foods with filtering and pagination
const getFoods = async (req, res) => {
  const result = foodQueryZodSchema.safeParse(req.query);

  if (!result.success) {
    const formattedErrors = zodError(result.error.issues);
    return res.status(httpCode.BAD_REQUEST).send({ error: formattedErrors });
  }

  try {
    const foods = await foodService.getFoods(result.data);
    return res.status(httpCode.OK).send(foods);
  } catch (error) {
    return res.status(httpCode.BAD_REQUEST).send({ error: error.message });
  }
};

// Get food by ID
const getFoodById = async (req, res) => {
  try {
    const { id } = req.params;
    const food = await foodService.getFoodById(id);
    
    if (!food) {
      return res.status(httpCode.NOT_FOUND).send({ error: "Food not found" });
    }

    return res.status(httpCode.OK).send(food);
  } catch (error) {
    return res.status(httpCode.BAD_REQUEST).send({ error: error.message });
  }
};

// Update food (Admin only)
const updateFood = async (req, res) => {
  const result = updateFoodZodSchema.safeParse(req.body);

  if (!result.success) {
    const formattedErrors = zodError(result.error.issues);
    return res.status(httpCode.BAD_REQUEST).send({ error: formattedErrors });
  }

  try {
    const { id } = req.params;
    const adminId = req.user?.userId || req.user?.adminId;
    
    const food = await foodService.updateFood(id, result.data, adminId);
    
    if (!food) {
      return res.status(httpCode.NOT_FOUND).send({ error: "Food not found" });
    }

    return res.status(httpCode.OK).send(food);
  } catch (error) {
    return res.status(httpCode.BAD_REQUEST).send({ error: error.message });
  }
};

// Delete food (Admin only)
const deleteFood = async (req, res) => {
  try {
    const { id } = req.params;
    const adminId = req.user?.userId || req.user?.adminId;
    
    const result = await foodService.deleteFood(id, adminId);
    
    if (!result) {
      return res.status(httpCode.NOT_FOUND).send({ error: "Food not found" });
    }

    return res.status(httpCode.OK).send({ message: "Food deleted successfully" });
  } catch (error) {
    return res.status(httpCode.BAD_REQUEST).send({ error: error.message });
  }
};

// Search foods (for users to select)
const searchFoods = async (req, res) => {
  try {
    const { q } = req.query;
    
    if (!q || q.trim().length < 2) {
      return res.status(httpCode.BAD_REQUEST).send({ 
        error: "Search query must be at least 2 characters" 
      });
    }

    const foods = await foodService.searchFoods(q.trim());
    return res.status(httpCode.OK).send(foods);
  } catch (error) {
    return res.status(httpCode.BAD_REQUEST).send({ error: error.message });
  }
};

// Get popular foods
const getPopularFoods = async (req, res) => {
  try {
    const { limit = 20 } = req.query;
    const foods = await foodService.getPopularFoods(parseInt(limit));
    return res.status(httpCode.OK).send(foods);
  } catch (error) {
    return res.status(httpCode.BAD_REQUEST).send({ error: error.message });
  }
};

// Verify food (Admin only)
const verifyFood = async (req, res) => {
  const result = foodVerificationZodSchema.safeParse(req.body);

  if (!result.success) {
    const formattedErrors = zodError(result.error.issues);
    return res.status(httpCode.BAD_REQUEST).send({ error: formattedErrors });
  }

  try {
    const { id } = req.params;
    const adminId = req.user?.userId || req.user?.adminId;
    
    const food = await foodService.verifyFood(id, adminId, result.data);
    
    if (!food) {
      return res.status(httpCode.NOT_FOUND).send({ error: "Food not found" });
    }

    return res.status(httpCode.OK).send(food);
  } catch (error) {
    return res.status(httpCode.BAD_REQUEST).send({ error: error.message });
  }
};

// Get food categories
const getFoodCategories = async (req, res) => {
  try {
    const categories = await foodService.getFoodCategories();
    return res.status(httpCode.OK).send(categories);
  } catch (error) {
    return res.status(httpCode.BAD_REQUEST).send({ error: error.message });
  }
};

export default {
  createFood,
  getFoods,
  getFoodById,
  updateFood,
  deleteFood,
  searchFoods,
  getPopularFoods,
  verifyFood,
  getFoodCategories
};
