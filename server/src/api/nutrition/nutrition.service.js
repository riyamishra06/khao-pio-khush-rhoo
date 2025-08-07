import { MNutritionEntry } from "../../models/nutrition.model.js";
import { MDailySummary } from "../../models/dailySummary.model.js";
import { MNutritionGoal } from "../../models/nutritionGoal.model.js";
import { MUserActivity } from "../../models/userActivity.model.js";
import mongoose, { isValidObjectId } from "mongoose";

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

// Get nutrition reports for date range
const getNutritionReports = async (userId, startDate, endDate) => {
  try {
    if (!isValidObjectId(userId)) {
      throw new Error("Invalid user ID");
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    // Validate date range
    if (start > end) {
      throw new Error("Start date cannot be after end date");
    }

    // Get daily summaries for the date range
    const summaries = await MDailySummary.find({
      userId,
      date: { $gte: start, $lte: end }
    }).sort({ date: 1 });

    // Get detailed entries for the date range
    const entries = await MNutritionEntry.find({
      userId,
      date: { $gte: start, $lte: end }
    })
    .populate('foodId', 'name brand category')
    .sort({ date: -1, createdAt: -1 });

    // Calculate totals for the period
    const totals = await MNutritionEntry.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(userId),
          date: { $gte: start, $lte: end }
        }
      },
      {
        $group: {
          _id: null,
          totalCalories: { $sum: '$calories' },
          totalProtein: { $sum: '$protein' },
          totalCarbs: { $sum: '$carbs' },
          totalFat: { $sum: '$fat' },
          totalFiber: { $sum: '$fiber' },
          totalSugar: { $sum: '$sugar' },
          totalSodium: { $sum: '$sodium' },
          entryCount: { $sum: 1 }
        }
      }
    ]);

    // Calculate averages
    const dayCount = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
    const periodTotals = totals[0] || {
      totalCalories: 0, totalProtein: 0, totalCarbs: 0, totalFat: 0,
      totalFiber: 0, totalSugar: 0, totalSodium: 0, entryCount: 0
    };

    const averages = {
      avgCalories: periodTotals.totalCalories / dayCount,
      avgProtein: periodTotals.totalProtein / dayCount,
      avgCarbs: periodTotals.totalCarbs / dayCount,
      avgFat: periodTotals.totalFat / dayCount,
      avgFiber: periodTotals.totalFiber / dayCount,
      avgSugar: periodTotals.totalSugar / dayCount,
      avgSodium: periodTotals.totalSodium / dayCount
    };

    return {
      dateRange: { startDate: start, endDate: end, dayCount },
      summaries,
      entries,
      totals: periodTotals,
      averages,
      generatedAt: new Date()
    };
  } catch (error) {
    throw new Error(`Failed to get nutrition reports: ${error.message}`);
  }
};

// Get chart data for visualization
const getChartData = async (userId, startDate, endDate, chartType = 'daily') => {
  try {
    if (!isValidObjectId(userId)) {
      throw new Error("Invalid user ID");
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    let groupBy = {};
    let sortBy = {};

    switch (chartType) {
      case 'daily':
        groupBy = {
          year: { $year: '$date' },
          month: { $month: '$date' },
          day: { $dayOfMonth: '$date' }
        };
        sortBy = { '_id.year': 1, '_id.month': 1, '_id.day': 1 };
        break;
      case 'weekly':
        groupBy = {
          year: { $year: '$date' },
          week: { $week: '$date' }
        };
        sortBy = { '_id.year': 1, '_id.week': 1 };
        break;
      case 'monthly':
        groupBy = {
          year: { $year: '$date' },
          month: { $month: '$date' }
        };
        sortBy = { '_id.year': 1, '_id.month': 1 };
        break;
      default:
        throw new Error("Invalid chart type. Use 'daily', 'weekly', or 'monthly'");
    }

    const chartData = await MNutritionEntry.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(userId),
          date: { $gte: start, $lte: end }
        }
      },
      {
        $group: {
          _id: groupBy,
          calories: { $sum: '$calories' },
          protein: { $sum: '$protein' },
          carbs: { $sum: '$carbs' },
          fat: { $sum: '$fat' },
          fiber: { $sum: '$fiber' },
          sugar: { $sum: '$sugar' },
          sodium: { $sum: '$sodium' },
          entryCount: { $sum: 1 }
        }
      },
      { $sort: sortBy }
    ]);

    return {
      chartType,
      dateRange: { startDate: start, endDate: end },
      data: chartData,
      generatedAt: new Date()
    };
  } catch (error) {
    throw new Error(`Failed to get chart data: ${error.message}`);
  }
};

// Get nutrition goals progress
const getGoalsProgress = async (userId, date = new Date()) => {
  try {
    if (!isValidObjectId(userId)) {
      throw new Error("Invalid user ID");
    }

    const targetDate = new Date(date);
    const startOfDay = new Date(targetDate.setHours(0, 0, 0, 0));
    const endOfDay = new Date(targetDate.setHours(23, 59, 59, 999));

    // Get user's nutrition goals
    const goals = await MNutritionGoal.findOne({ userId, isActive: true });

    if (!goals) {
      throw new Error("No active nutrition goals found for user");
    }

    // Get daily summary for the date
    const summary = await MDailySummary.findOne({
      userId,
      date: { $gte: startOfDay, $lte: endOfDay }
    });

    if (!summary) {
      // Return goals with zero progress if no entries for the day
      return {
        date: targetDate,
        goals: {
          calories: goals.dailyCalories,
          protein: goals.dailyProtein,
          carbs: goals.dailyCarbs,
          fat: goals.dailyFat,
          fiber: goals.dailyFiber,
          sugar: goals.dailySugar,
          sodium: goals.dailySodium
        },
        consumed: {
          calories: 0, protein: 0, carbs: 0, fat: 0,
          fiber: 0, sugar: 0, sodium: 0
        },
        progress: {
          calories: 0, protein: 0, carbs: 0, fat: 0,
          fiber: 0, sugar: 0, sodium: 0
        },
        remaining: {
          calories: goals.dailyCalories,
          protein: goals.dailyProtein,
          carbs: goals.dailyCarbs,
          fat: goals.dailyFat,
          fiber: goals.dailyFiber,
          sugar: goals.dailySugar,
          sodium: goals.dailySodium
        }
      };
    }

    // Calculate progress percentages
    const progress = {
      calories: Math.round((summary.totalCalories / goals.dailyCalories) * 100),
      protein: Math.round((summary.totalProtein / goals.dailyProtein) * 100),
      carbs: Math.round((summary.totalCarbs / goals.dailyCarbs) * 100),
      fat: Math.round((summary.totalFat / goals.dailyFat) * 100),
      fiber: Math.round((summary.totalFiber / goals.dailyFiber) * 100),
      sugar: Math.round((summary.totalSugar / goals.dailySugar) * 100),
      sodium: Math.round((summary.totalSodium / goals.dailySodium) * 100)
    };

    // Calculate remaining amounts
    const remaining = {
      calories: Math.max(0, goals.dailyCalories - summary.totalCalories),
      protein: Math.max(0, goals.dailyProtein - summary.totalProtein),
      carbs: Math.max(0, goals.dailyCarbs - summary.totalCarbs),
      fat: Math.max(0, goals.dailyFat - summary.totalFat),
      fiber: Math.max(0, goals.dailyFiber - summary.totalFiber),
      sugar: Math.max(0, goals.dailySugar - summary.totalSugar),
      sodium: Math.max(0, goals.dailySodium - summary.totalSodium)
    };

    return {
      date: targetDate,
      goals: {
        calories: goals.dailyCalories,
        protein: goals.dailyProtein,
        carbs: goals.dailyCarbs,
        fat: goals.dailyFat,
        fiber: goals.dailyFiber,
        sugar: goals.dailySugar,
        sodium: goals.dailySodium
      },
      consumed: {
        calories: summary.totalCalories,
        protein: summary.totalProtein,
        carbs: summary.totalCarbs,
        fat: summary.totalFat,
        fiber: summary.totalFiber,
        sugar: summary.totalSugar,
        sodium: summary.totalSodium
      },
      progress,
      remaining
    };
  } catch (error) {
    throw new Error(`Failed to get goals progress: ${error.message}`);
  }
};

export default {
  createNutritionEntry,
  getNutritionEntries,
  getNutritionEntryById,
  updateNutritionEntry,
  deleteNutritionEntry,
  getDailySummary,
  updateDailySummary,
  getNutritionReports,
  getChartData,
  getGoalsProgress
};
