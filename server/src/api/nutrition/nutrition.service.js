import { MNutritionEntry } from "../../models/nutrition.model.js";
import { MDailySummary } from "../../models/dailySummary.model.js";
import { MNutritionGoal } from "../../models/nutritionGoal.model.js";
import { MUserActivity } from "../../models/userActivity.model.js";
import { isValidObjectId } from "mongoose";

const createNutritionEntry = async (userId, data) => {
  // Create nutrition entry
  const nutritionEntry = new MNutritionEntry({
    ...data,
    userId,
    date: new Date(data.date)
  });

  await nutritionEntry.save();

  // Update daily summary
  await updateDailySummary(userId, new Date(data.date));

  // Log activity
  await MUserActivity.create({
    userId,
    activityType: "nutrition_entry_added",
    description: `Added ${data.foodItem} to ${data.mealType}`,
    metadata: { entryId: nutritionEntry._id, foodItem: data.foodItem }
  });

  return {
    message: "Nutrition entry created successfully",
    data: nutritionEntry
  };
};

const getNutritionEntries = async (userId, query) => {
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;
  const skip = (page - 1) * limit;

  let searchQuery = { userId };

  // Date filtering
  if (query.date) {
    const date = new Date(query.date);
    const startOfDay = new Date(date.setHours(0, 0, 0, 0));
    const endOfDay = new Date(date.setHours(23, 59, 59, 999));
    searchQuery.date = { $gte: startOfDay, $lte: endOfDay };
  } else if (query.startDate && query.endDate) {
    searchQuery.date = {
      $gte: new Date(query.startDate),
      $lte: new Date(query.endDate)
    };
  }

  // Meal type filtering
  if (query.mealType) {
    searchQuery.mealType = query.mealType;
  }

  const [entries, total] = await Promise.all([
    MNutritionEntry.find(searchQuery)
      .populate('foodId', 'name brand category')
      .sort({ date: -1, createdAt: -1 })
      .skip(skip)
      .limit(limit),
    MNutritionEntry.countDocuments(searchQuery)
  ]);

  return {
    entries,
    total,
    totalPages: Math.ceil(total / limit),
    currentPage: page,
    hasNextPage: page < Math.ceil(total / limit),
    hasPrevPage: page > 1
  };
};

const getNutritionEntryById = async (userId, entryId) => {
  if (!isValidObjectId(entryId)) {
    throw new Error("Invalid entry ID");
  }

  const entry = await MNutritionEntry.findOne({ _id: entryId, userId })
    .populate('foodId', 'name brand category nutritionPer100g');

  if (!entry) {
    throw new Error("Nutrition entry not found");
  }

  return entry;
};

const updateNutritionEntry = async (userId, entryId, data) => {
  if (!isValidObjectId(entryId)) {
    throw new Error("Invalid entry ID");
  }

  const entry = await MNutritionEntry.findOne({ _id: entryId, userId });
  if (!entry) {
    throw new Error("Nutrition entry not found");
  }

  const oldDate = entry.date;
  
  // Update entry
  Object.assign(entry, data);
  if (data.date) {
    entry.date = new Date(data.date);
  }
  
  await entry.save();

  // Update daily summaries for both old and new dates
  await updateDailySummary(userId, oldDate);
  if (data.date && oldDate.toDateString() !== new Date(data.date).toDateString()) {
    await updateDailySummary(userId, new Date(data.date));
  }

  // Log activity
  await MUserActivity.create({
    userId,
    activityType: "nutrition_entry_updated",
    description: `Updated ${entry.foodItem}`,
    metadata: { entryId: entry._id, foodItem: entry.foodItem }
  });

  return {
    message: "Nutrition entry updated successfully",
    data: entry
  };
};

const deleteNutritionEntry = async (userId, entryId) => {
  if (!isValidObjectId(entryId)) {
    throw new Error("Invalid entry ID");
  }

  const entry = await MNutritionEntry.findOne({ _id: entryId, userId });
  if (!entry) {
    throw new Error("Nutrition entry not found");
  }

  const entryDate = entry.date;
  const foodItem = entry.foodItem;

  await MNutritionEntry.deleteOne({ _id: entryId });

  // Update daily summary
  await updateDailySummary(userId, entryDate);

  // Log activity
  await MUserActivity.create({
    userId,
    activityType: "nutrition_entry_deleted",
    description: `Deleted ${foodItem}`,
    metadata: { foodItem }
  });

  return {
    message: "Nutrition entry deleted successfully"
  };
};

const getDailySummary = async (userId, date) => {
  const targetDate = new Date(date);
  const startOfDay = new Date(targetDate.setHours(0, 0, 0, 0));
  const endOfDay = new Date(targetDate.setHours(23, 59, 59, 999));

  let summary = await MDailySummary.findOne({
    userId,
    date: { $gte: startOfDay, $lte: endOfDay }
  });

  if (!summary) {
    // Create summary if it doesn't exist
    summary = await updateDailySummary(userId, new Date(date));
  }

  return summary;
};

// Helper function to update daily summary
const updateDailySummary = async (userId, date) => {
  const targetDate = new Date(date);
  const startOfDay = new Date(targetDate.setHours(0, 0, 0, 0));
  const endOfDay = new Date(targetDate.setHours(23, 59, 59, 999));

  // Get all entries for the day
  const entries = await MNutritionEntry.find({
    userId,
    date: { $gte: startOfDay, $lte: endOfDay }
  });

  // Calculate totals
  const totals = entries.reduce((acc, entry) => {
    acc.totalCalories += entry.calories || 0;
    acc.totalProtein += entry.protein || 0;
    acc.totalCarbs += entry.carbs || 0;
    acc.totalFat += entry.fat || 0;
    acc.totalFiber += entry.fiber || 0;
    acc.totalSugar += entry.sugar || 0;
    acc.totalSodium += entry.sodium || 0;
    acc.totalEntries += 1;

    // Meal breakdown
    const mealType = entry.mealType || 'snack';
    if (!acc.mealBreakdown[mealType]) {
      acc.mealBreakdown[mealType] = {
        calories: 0, protein: 0, carbs: 0, fat: 0, entryCount: 0
      };
    }
    
    acc.mealBreakdown[mealType].calories += entry.calories || 0;
    acc.mealBreakdown[mealType].protein += entry.protein || 0;
    acc.mealBreakdown[mealType].carbs += entry.carbs || 0;
    acc.mealBreakdown[mealType].fat += entry.fat || 0;
    acc.mealBreakdown[mealType].entryCount += 1;

    return acc;
  }, {
    totalCalories: 0,
    totalProtein: 0,
    totalCarbs: 0,
    totalFat: 0,
    totalFiber: 0,
    totalSugar: 0,
    totalSodium: 0,
    totalEntries: 0,
    mealBreakdown: {
      breakfast: { calories: 0, protein: 0, carbs: 0, fat: 0, entryCount: 0 },
      lunch: { calories: 0, protein: 0, carbs: 0, fat: 0, entryCount: 0 },
      dinner: { calories: 0, protein: 0, carbs: 0, fat: 0, entryCount: 0 },
      snack: { calories: 0, protein: 0, carbs: 0, fat: 0, entryCount: 0 }
    }
  });

  // Get user goals
  const goals = await MNutritionGoal.findOne({ userId, isActive: true });

  const summaryData = {
    userId,
    date: startOfDay,
    ...totals,
    goalCalories: goals?.dailyCalories || 0,
    goalProtein: goals?.dailyProtein || 0,
    goalCarbs: goals?.dailyCarbs || 0,
    goalFat: goals?.dailyFat || 0
  };

  // Update or create summary
  let summary = await MDailySummary.findOneAndUpdate(
    { userId, date: { $gte: startOfDay, $lte: endOfDay } },
    summaryData,
    { upsert: true, new: true }
  );

  // Calculate balances and percentages
  summary.calculateBalances();
  await summary.save();

  return summary;
};

export default {
  createNutritionEntry,
  getNutritionEntries,
  getNutritionEntryById,
  updateNutritionEntry,
  deleteNutritionEntry,
  getDailySummary,
  updateDailySummary
};
