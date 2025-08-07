import { MFood } from "../../models/food.model.js";
import { isValidObjectId } from "mongoose";

// Create new food item
const createFood = async (adminId, foodData) => {
  try {
    const food = new MFood({
      ...foodData,
      addedBy: adminId,
      isVerified: true, // Admin-added foods are automatically verified
      verifiedBy: adminId
    });

    await food.save();
    return food;
  } catch (error) {
    if (error.code === 11000) {
      throw new Error("Food with this barcode already exists");
    }
    throw new Error(`Failed to create food: ${error.message}`);
  }
};

// Get foods with filtering and pagination
const getFoods = async (filters) => {
  try {
    const { search, category, isVerified, isPublic, page, limit } = filters;
    
    // Build query
    let query = {};
    
    if (search) {
      query.$text = { $search: search };
    }
    
    if (category) {
      query.category = category;
    }
    
    if (isVerified !== undefined) {
      query.isVerified = isVerified;
    }
    
    if (isPublic !== undefined) {
      query.isPublic = isPublic;
    }

    // Calculate pagination
    const skip = (page - 1) * limit;
    
    // Execute query with pagination
    const foods = await MFood.find(query)
      .populate('addedBy', 'username email')
      .populate('verifiedBy', 'username email')
      .sort(search ? { score: { $meta: 'textScore' } } : { usageCount: -1, createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    // Get total count for pagination
    const total = await MFood.countDocuments(query);
    
    return {
      foods,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    };
  } catch (error) {
    throw new Error(`Failed to get foods: ${error.message}`);
  }
};

// Get food by ID
const getFoodById = async (id) => {
  try {
    if (!isValidObjectId(id)) {
      throw new Error("Invalid food ID");
    }

    const food = await MFood.findById(id)
      .populate('addedBy', 'username email')
      .populate('verifiedBy', 'username email');

    return food;
  } catch (error) {
    throw new Error(`Failed to get food: ${error.message}`);
  }
};

// Update food
const updateFood = async (id, updateData, adminId) => {
  try {
    if (!isValidObjectId(id)) {
      throw new Error("Invalid food ID");
    }

    const food = await MFood.findByIdAndUpdate(
      id,
      { 
        ...updateData,
        updatedBy: adminId,
        updatedAt: new Date()
      },
      { new: true, runValidators: true }
    ).populate('addedBy', 'username email')
     .populate('verifiedBy', 'username email');

    return food;
  } catch (error) {
    if (error.code === 11000) {
      throw new Error("Food with this barcode already exists");
    }
    throw new Error(`Failed to update food: ${error.message}`);
  }
};

// Delete food
const deleteFood = async (id, adminId) => {
  try {
    if (!isValidObjectId(id)) {
      throw new Error("Invalid food ID");
    }

    const food = await MFood.findByIdAndDelete(id);
    return food;
  } catch (error) {
    throw new Error(`Failed to delete food: ${error.message}`);
  }
};

// Search foods for user selection
const searchFoods = async (searchQuery) => {
  try {
    const foods = await MFood.find({
      $and: [
        { isPublic: true },
        { isVerified: true },
        {
          $or: [
            { name: { $regex: searchQuery, $options: 'i' } },
            { brand: { $regex: searchQuery, $options: 'i' } },
            { description: { $regex: searchQuery, $options: 'i' } },
            { tags: { $in: [new RegExp(searchQuery, 'i')] } }
          ]
        }
      ]
    })
    .select('name brand category servingSize servingUnit nutritionPer100g displayName usageCount')
    .sort({ usageCount: -1, name: 1 })
    .limit(50)
    .lean();

    return foods;
  } catch (error) {
    throw new Error(`Failed to search foods: ${error.message}`);
  }
};

// Get popular foods
const getPopularFoods = async (limit = 20) => {
  try {
    const foods = await MFood.find({
      isPublic: true,
      isVerified: true
    })
    .select('name brand category servingSize servingUnit nutritionPer100g displayName usageCount')
    .sort({ usageCount: -1, createdAt: -1 })
    .limit(limit)
    .lean();

    return foods;
  } catch (error) {
    throw new Error(`Failed to get popular foods: ${error.message}`);
  }
};

// Verify food
const verifyFood = async (id, adminId, verificationData) => {
  try {
    if (!isValidObjectId(id)) {
      throw new Error("Invalid food ID");
    }

    const food = await MFood.findByIdAndUpdate(
      id,
      {
        isVerified: verificationData.isVerified,
        verifiedBy: verificationData.isVerified ? adminId : null,
        verificationNotes: verificationData.verificationNotes,
        verifiedAt: verificationData.isVerified ? new Date() : null
      },
      { new: true, runValidators: true }
    ).populate('addedBy', 'username email')
     .populate('verifiedBy', 'username email');

    return food;
  } catch (error) {
    throw new Error(`Failed to verify food: ${error.message}`);
  }
};

// Get food categories with counts
const getFoodCategories = async () => {
  try {
    const categories = await MFood.aggregate([
      {
        $match: { isPublic: true, isVerified: true }
      },
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 }
        }
      },
      {
        $sort: { count: -1 }
      }
    ]);

    return categories.map(cat => ({
      category: cat._id,
      count: cat.count
    }));
  } catch (error) {
    throw new Error(`Failed to get food categories: ${error.message}`);
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
