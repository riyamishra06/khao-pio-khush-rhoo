import nutritionService from "./nutrition.service.js";
import httpCode from "http-status-codes";
import { 
  nutritionEntryZodSchema, 
  updateNutritionEntryZodSchema,
  nutritionQueryZodSchema,
  dailySummaryQueryZodSchema 
} from "./nutrition.validator.js";
import { zodError } from "../../utils/zodErrorFormat.js";

const createNutritionEntry = async (req, res) => {
  const result = nutritionEntryZodSchema.safeParse(req.body);

  if (!result.success) {
    const formattedErrors = zodError(result.error.issues);
    return res.status(httpCode.BAD_REQUEST).send({ error: formattedErrors });
  }

  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(httpCode.UNAUTHORIZED).send({ error: "User not authenticated" });
    }

    const nutritionEntry = await nutritionService.createNutritionEntry(userId, result.data);
    return res.status(httpCode.CREATED).send(nutritionEntry);
  } catch (error) {
    return res.status(httpCode.BAD_REQUEST).send({ error: error.message });
  }
};

const getNutritionEntries = async (req, res) => {
  const queryResult = nutritionQueryZodSchema.safeParse(req.query);

  if (!queryResult.success) {
    const formattedErrors = zodError(queryResult.error.issues);
    return res.status(httpCode.BAD_REQUEST).send({ error: formattedErrors });
  }

  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(httpCode.UNAUTHORIZED).send({ error: "User not authenticated" });
    }

    const entries = await nutritionService.getNutritionEntries(userId, queryResult.data);
    return res.status(httpCode.OK).send(entries);
  } catch (error) {
    return res.status(httpCode.BAD_REQUEST).send({ error: error.message });
  }
};

const getNutritionEntryById = async (req, res) => {
  try {
    const userId = req.user?.userId;
    const entryId = req.params.id;

    if (!userId) {
      return res.status(httpCode.UNAUTHORIZED).send({ error: "User not authenticated" });
    }

    const entry = await nutritionService.getNutritionEntryById(userId, entryId);
    return res.status(httpCode.OK).send({ data: entry });
  } catch (error) {
    return res.status(httpCode.BAD_REQUEST).send({ error: error.message });
  }
};

const updateNutritionEntry = async (req, res) => {
  const result = updateNutritionEntryZodSchema.safeParse(req.body);

  if (!result.success) {
    const formattedErrors = zodError(result.error.issues);
    return res.status(httpCode.BAD_REQUEST).send({ error: formattedErrors });
  }

  try {
    const userId = req.user?.userId;
    const entryId = req.params.id;

    if (!userId) {
      return res.status(httpCode.UNAUTHORIZED).send({ error: "User not authenticated" });
    }

    const updatedEntry = await nutritionService.updateNutritionEntry(userId, entryId, result.data);
    return res.status(httpCode.OK).send(updatedEntry);
  } catch (error) {
    return res.status(httpCode.BAD_REQUEST).send({ error: error.message });
  }
};

const deleteNutritionEntry = async (req, res) => {
  try {
    const userId = req.user?.userId;
    const entryId = req.params.id;

    if (!userId) {
      return res.status(httpCode.UNAUTHORIZED).send({ error: "User not authenticated" });
    }

    const result = await nutritionService.deleteNutritionEntry(userId, entryId);
    return res.status(httpCode.OK).send(result);
  } catch (error) {
    return res.status(httpCode.BAD_REQUEST).send({ error: error.message });
  }
};

const getDailySummary = async (req, res) => {
  const queryResult = dailySummaryQueryZodSchema.safeParse(req.query);

  if (!queryResult.success) {
    const formattedErrors = zodError(queryResult.error.issues);
    return res.status(httpCode.BAD_REQUEST).send({ error: formattedErrors });
  }

  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(httpCode.UNAUTHORIZED).send({ error: "User not authenticated" });
    }

    const summary = await nutritionService.getDailySummary(userId, queryResult.data.date);
    return res.status(httpCode.OK).send({ data: summary });
  } catch (error) {
    return res.status(httpCode.BAD_REQUEST).send({ error: error.message });
  }
};

const getNutritionStats = async (req, res) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(httpCode.UNAUTHORIZED).send({ error: "User not authenticated" });
    }

    // This will be implemented in the advanced features
    return res.status(httpCode.NOT_IMPLEMENTED).send({ 
      message: "Nutrition stats endpoint coming soon" 
    });
  } catch (error) {
    return res.status(httpCode.BAD_REQUEST).send({ error: error.message });
  }
};

export default {
  createNutritionEntry,
  getNutritionEntries,
  getNutritionEntryById,
  updateNutritionEntry,
  deleteNutritionEntry,
  getDailySummary,
  getNutritionStats
};
