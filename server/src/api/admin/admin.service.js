import { MUser } from "../../models/user.model.js";
import { MFood } from "../../models/food.model.js";
import { MNutritionEntry } from "../../models/nutrition.model.js";
import { MDailySummary } from "../../models/dailySummary.model.js";
import { MUserActivity } from "../../models/userActivity.model.js";
import { isValidObjectId } from "mongoose";

// Get users with filtering and pagination
const getUsers = async (filters) => {
  try {
    const { search, role, page, limit } = filters;
    
    // Build query
    let query = {};
    
    if (search) {
      query.$or = [
        { username: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (role) {
      query.role = role;
    }

    // Calculate pagination
    const skip = (page - 1) * limit;
    
    // Execute query with pagination
    const users = await MUser.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    // Get total count for pagination
    const total = await MUser.countDocuments(query);
    
    return {
      users,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    };
  } catch (error) {
    throw new Error(`Failed to get users: ${error.message}`);
  }
};

// Get user by ID
const getUserById = async (id) => {
  try {
    if (!isValidObjectId(id)) {
      throw new Error("Invalid user ID");
    }

    const user = await MUser.findById(id).select('-password');
    return user;
  } catch (error) {
    throw new Error(`Failed to get user: ${error.message}`);
  }
};

// Update user
const updateUser = async (id, updateData) => {
  try {
    if (!isValidObjectId(id)) {
      throw new Error("Invalid user ID");
    }

    const user = await MUser.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).select('-password');

    return user;
  } catch (error) {
    throw new Error(`Failed to update user: ${error.message}`);
  }
};

// Delete user
const deleteUser = async (id) => {
  try {
    if (!isValidObjectId(id)) {
      throw new Error("Invalid user ID");
    }

    // Also delete user's nutrition entries and summaries
    await MNutritionEntry.deleteMany({ userId: id });
    await MDailySummary.deleteMany({ userId: id });
    await MUserActivity.deleteMany({ userId: id });

    const user = await MUser.findByIdAndDelete(id);
    return user;
  } catch (error) {
    throw new Error(`Failed to delete user: ${error.message}`);
  }
};

// Get system statistics
const getSystemStats = async (filters) => {
  try {
    const { startDate, endDate } = filters;
    
    // Date range for filtering
    const dateFilter = {};
    if (startDate) dateFilter.$gte = new Date(startDate);
    if (endDate) dateFilter.$lte = new Date(endDate);
    
    const dateQuery = Object.keys(dateFilter).length > 0 ? { createdAt: dateFilter } : {};

    // Get counts
    const [
      totalUsers,
      totalFoods,
      totalNutritionEntries,
      newUsersThisMonth,
      activeUsersToday
    ] = await Promise.all([
      MUser.countDocuments(),
      MFood.countDocuments(),
      MNutritionEntry.countDocuments(dateQuery),
      MUser.countDocuments({
        createdAt: {
          $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
        }
      }),
      MNutritionEntry.distinct('userId', {
        createdAt: {
          $gte: new Date(new Date().setHours(0, 0, 0, 0))
        }
      }).then(users => users.length)
    ]);

    return {
      totalUsers,
      totalFoods,
      totalNutritionEntries,
      newUsersThisMonth,
      activeUsersToday,
      generatedAt: new Date()
    };
  } catch (error) {
    throw new Error(`Failed to get system stats: ${error.message}`);
  }
};

// Get user activity analytics
const getUserAnalytics = async (startDate, endDate) => {
  try {
    const matchStage = {};
    if (startDate || endDate) {
      matchStage.createdAt = {};
      if (startDate) matchStage.createdAt.$gte = new Date(startDate);
      if (endDate) matchStage.createdAt.$lte = new Date(endDate);
    }

    const analytics = await MUser.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
            day: { $dayOfMonth: '$createdAt' }
          },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 }
      }
    ]);

    return analytics;
  } catch (error) {
    throw new Error(`Failed to get user analytics: ${error.message}`);
  }
};

// Get nutrition analytics
const getNutritionAnalytics = async (startDate, endDate) => {
  try {
    const matchStage = {};
    if (startDate || endDate) {
      matchStage.date = {};
      if (startDate) matchStage.date.$gte = new Date(startDate);
      if (endDate) matchStage.date.$lte = new Date(endDate);
    }

    const analytics = await MNutritionEntry.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: {
            year: { $year: '$date' },
            month: { $month: '$date' },
            day: { $dayOfMonth: '$date' }
          },
          totalCalories: { $sum: '$calories' },
          totalProtein: { $sum: '$protein' },
          totalCarbs: { $sum: '$carbs' },
          totalFat: { $sum: '$fat' },
          entryCount: { $sum: 1 }
        }
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 }
      }
    ]);

    return analytics;
  } catch (error) {
    throw new Error(`Failed to get nutrition analytics: ${error.message}`);
  }
};

// Get food analytics
const getFoodAnalytics = async () => {
  try {
    const [categoryStats, popularFoods, verificationStats] = await Promise.all([
      // Category distribution
      MFood.aggregate([
        {
          $group: {
            _id: '$category',
            count: { $sum: 1 },
            avgUsage: { $avg: '$usageCount' }
          }
        },
        { $sort: { count: -1 } }
      ]),
      
      // Most popular foods
      MFood.find({ isPublic: true, isVerified: true })
        .select('name brand category usageCount')
        .sort({ usageCount: -1 })
        .limit(10)
        .lean(),
      
      // Verification stats
      MFood.aggregate([
        {
          $group: {
            _id: '$isVerified',
            count: { $sum: 1 }
          }
        }
      ])
    ]);

    return {
      categoryStats,
      popularFoods,
      verificationStats,
      generatedAt: new Date()
    };
  } catch (error) {
    throw new Error(`Failed to get food analytics: ${error.message}`);
  }
};

// Export user data
const exportUserData = async (format) => {
  try {
    const users = await MUser.find().select('-password').lean();
    
    if (format === 'csv') {
      // Convert to CSV format
      const headers = ['ID', 'Username', 'Email', 'Role', 'Created At'];
      const csvData = [
        headers.join(','),
        ...users.map(user => [
          user._id,
          user.username,
          user.email,
          user.role,
          user.createdAt
        ].join(','))
      ].join('\n');
      
      return csvData;
    }
    
    return users;
  } catch (error) {
    throw new Error(`Failed to export user data: ${error.message}`);
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
