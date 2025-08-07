import mongoose from "mongoose";
import dotenv from "dotenv";
import { MFood } from "../src/models/food.model.js";
import { Madmin } from "../src/models/admin.model.js";

dotenv.config();

const sampleFoods = [
  {
    name: "Apple",
    brand: "",
    category: "fruits",
    servingSize: "100",
    servingUnit: "g",
    nutritionPer100g: {
      calories: 52,
      protein: 0.3,
      carbs: 14,
      fat: 0.2,
      fiber: 2.4,
      sugar: 10,
      sodium: 1
    },
    description: "Fresh red apple",
    tags: ["fresh", "fruit", "healthy"],
    isVerified: true,
    isPublic: true
  },
  {
    name: "Banana",
    brand: "",
    category: "fruits",
    servingSize: "100",
    servingUnit: "g",
    nutritionPer100g: {
      calories: 89,
      protein: 1.1,
      carbs: 23,
      fat: 0.3,
      fiber: 2.6,
      sugar: 12,
      sodium: 1
    },
    description: "Fresh yellow banana",
    tags: ["fresh", "fruit", "potassium"],
    isVerified: true,
    isPublic: true
  },
  {
    name: "Chicken Breast",
    brand: "",
    category: "proteins",
    servingSize: "100",
    servingUnit: "g",
    nutritionPer100g: {
      calories: 165,
      protein: 31,
      carbs: 0,
      fat: 3.6,
      fiber: 0,
      sugar: 0,
      sodium: 74
    },
    description: "Skinless, boneless chicken breast",
    tags: ["protein", "lean", "meat"],
    isVerified: true,
    isPublic: true
  },
  {
    name: "Brown Rice",
    brand: "",
    category: "grains",
    servingSize: "100",
    servingUnit: "g",
    nutritionPer100g: {
      calories: 111,
      protein: 2.6,
      carbs: 23,
      fat: 0.9,
      fiber: 1.8,
      sugar: 0.4,
      sodium: 5
    },
    description: "Cooked brown rice",
    tags: ["whole grain", "fiber", "carbs"],
    isVerified: true,
    isPublic: true
  },
  {
    name: "Broccoli",
    brand: "",
    category: "vegetables",
    servingSize: "100",
    servingUnit: "g",
    nutritionPer100g: {
      calories: 34,
      protein: 2.8,
      carbs: 7,
      fat: 0.4,
      fiber: 2.6,
      sugar: 1.5,
      sodium: 33
    },
    description: "Fresh broccoli florets",
    tags: ["vegetable", "vitamin C", "fiber"],
    isVerified: true,
    isPublic: true
  },
  {
    name: "Salmon",
    brand: "",
    category: "proteins",
    servingSize: "100",
    servingUnit: "g",
    nutritionPer100g: {
      calories: 208,
      protein: 20,
      carbs: 0,
      fat: 13,
      fiber: 0,
      sugar: 0,
      sodium: 59
    },
    description: "Atlantic salmon fillet",
    tags: ["fish", "omega-3", "protein"],
    isVerified: true,
    isPublic: true
  },
  {
    name: "Greek Yogurt",
    brand: "",
    category: "dairy",
    servingSize: "100",
    servingUnit: "g",
    nutritionPer100g: {
      calories: 59,
      protein: 10,
      carbs: 3.6,
      fat: 0.4,
      fiber: 0,
      sugar: 3.6,
      sodium: 36
    },
    description: "Plain Greek yogurt, non-fat",
    tags: ["dairy", "protein", "probiotics"],
    isVerified: true,
    isPublic: true
  },
  {
    name: "Almonds",
    brand: "",
    category: "nuts_seeds",
    servingSize: "100",
    servingUnit: "g",
    nutritionPer100g: {
      calories: 579,
      protein: 21,
      carbs: 22,
      fat: 50,
      fiber: 12,
      sugar: 4.4,
      sodium: 1
    },
    description: "Raw almonds",
    tags: ["nuts", "healthy fats", "protein"],
    isVerified: true,
    isPublic: true
  },
  {
    name: "Spinach",
    brand: "",
    category: "vegetables",
    servingSize: "100",
    servingUnit: "g",
    nutritionPer100g: {
      calories: 23,
      protein: 2.9,
      carbs: 3.6,
      fat: 0.4,
      fiber: 2.2,
      sugar: 0.4,
      sodium: 79
    },
    description: "Fresh spinach leaves",
    tags: ["leafy green", "iron", "vitamins"],
    isVerified: true,
    isPublic: true
  },
  {
    name: "Oats",
    brand: "",
    category: "grains",
    servingSize: "100",
    servingUnit: "g",
    nutritionPer100g: {
      calories: 389,
      protein: 17,
      carbs: 66,
      fat: 7,
      fiber: 11,
      sugar: 0.99,
      sodium: 2
    },
    description: "Rolled oats, dry",
    tags: ["whole grain", "fiber", "breakfast"],
    isVerified: true,
    isPublic: true
  }
];

async function seedDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.DB_URL);
    console.log("Connected to MongoDB");

    // Create default admin if not exists
    const adminExists = await Madmin.findOne({ email: "admin@nutritiontracker.com" });
    let adminId;

    if (!adminExists) {
      const admin = new Madmin({
        username: "admin",
        email: "admin@nutritiontracker.com",
        password: "admin123456",
        role: "admin",
        permissions: ["manage_users", "manage_foods", "view_analytics", "manage_system", "export_data"]
      });
      await admin.save();
      adminId = admin._id;
      console.log("Default admin created");
    } else {
      adminId = adminExists._id;
      console.log("Admin already exists");
    }

    // Clear existing foods
    await MFood.deleteMany({});
    console.log("Cleared existing foods");

    // Add sample foods
    const foodsWithAdmin = sampleFoods.map(food => ({
      ...food,
      addedBy: adminId,
      verifiedBy: adminId
    }));

    await MFood.insertMany(foodsWithAdmin);
    console.log(`Inserted ${sampleFoods.length} sample foods`);

    console.log("Database seeded successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
}

seedDatabase();
