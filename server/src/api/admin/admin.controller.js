import adminService from "./admin.service.js";
import httpCode from "http-status-codes";
import { 
  userQueryZodSchema,
  updateUserZodSchema,
  adminStatsQueryZodSchema 
} from "./admin.validator.js";
import { zodError } from "../../utils/zodErrorFormat.js";

// Get all users with filtering and pagination
const getUsers = async (req, res) => {
  const result = userQueryZodSchema.safeParse(req.query);

  if (!result.success) {
    const formattedErrors = zodError(result.error.issues);
    return res.status(httpCode.BAD_REQUEST).send({ error: formattedErrors });
  }

  try {
    const users = await adminService.getUsers(result.data);
    return res.status(httpCode.OK).send(users);
  } catch (error) {
    return res.status(httpCode.BAD_REQUEST).send({ error: error.message });
  }
};

// Get user by ID
const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await adminService.getUserById(id);
    
    if (!user) {
      return res.status(httpCode.NOT_FOUND).send({ error: "User not found" });
    }

    return res.status(httpCode.OK).send(user);
  } catch (error) {
    return res.status(httpCode.BAD_REQUEST).send({ error: error.message });
  }
};

// Update user
const updateUser = async (req, res) => {
  const result = updateUserZodSchema.safeParse(req.body);

  if (!result.success) {
    const formattedErrors = zodError(result.error.issues);
    return res.status(httpCode.BAD_REQUEST).send({ error: formattedErrors });
  }

  try {
    const { id } = req.params;
    const user = await adminService.updateUser(id, result.data);
    
    if (!user) {
      return res.status(httpCode.NOT_FOUND).send({ error: "User not found" });
    }

    return res.status(httpCode.OK).send(user);
  } catch (error) {
    return res.status(httpCode.BAD_REQUEST).send({ error: error.message });
  }
};

// Delete user
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await adminService.deleteUser(id);
    
    if (!result) {
      return res.status(httpCode.NOT_FOUND).send({ error: "User not found" });
    }

    return res.status(httpCode.OK).send({ message: "User deleted successfully" });
  } catch (error) {
    return res.status(httpCode.BAD_REQUEST).send({ error: error.message });
  }
};

// Get system statistics
const getSystemStats = async (req, res) => {
  const result = adminStatsQueryZodSchema.safeParse(req.query);

  if (!result.success) {
    const formattedErrors = zodError(result.error.issues);
    return res.status(httpCode.BAD_REQUEST).send({ error: formattedErrors });
  }

  try {
    const stats = await adminService.getSystemStats(result.data);
    return res.status(httpCode.OK).send(stats);
  } catch (error) {
    return res.status(httpCode.BAD_REQUEST).send({ error: error.message });
  }
};

// Get user activity analytics
const getUserAnalytics = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const analytics = await adminService.getUserAnalytics(startDate, endDate);
    return res.status(httpCode.OK).send(analytics);
  } catch (error) {
    return res.status(httpCode.BAD_REQUEST).send({ error: error.message });
  }
};

// Get nutrition analytics
const getNutritionAnalytics = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const analytics = await adminService.getNutritionAnalytics(startDate, endDate);
    return res.status(httpCode.OK).send(analytics);
  } catch (error) {
    return res.status(httpCode.BAD_REQUEST).send({ error: error.message });
  }
};

// Get food analytics
const getFoodAnalytics = async (req, res) => {
  try {
    const analytics = await adminService.getFoodAnalytics();
    return res.status(httpCode.OK).send(analytics);
  } catch (error) {
    return res.status(httpCode.BAD_REQUEST).send({ error: error.message });
  }
};

// Export user data
const exportUserData = async (req, res) => {
  try {
    const { format = 'json' } = req.query;
    const data = await adminService.exportUserData(format);
    
    res.setHeader('Content-Type', format === 'csv' ? 'text/csv' : 'application/json');
    res.setHeader('Content-Disposition', `attachment; filename=users.${format}`);
    
    return res.status(httpCode.OK).send(data);
  } catch (error) {
    return res.status(httpCode.BAD_REQUEST).send({ error: error.message });
  }
};

export default {
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  getSystemStats,
  getUserAnalytics,
  getNutritionAnalytics,
  getFoodAnalytics,
  exportUserData
};
