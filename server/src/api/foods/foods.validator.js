import { z } from "zod";

export const foodZodSchema = z.object({
  name: z
    .string()
    .min(1, { message: "Food name is required" })
    .max(100, { message: "Food name too long" }),
  brand: z
    .string()
    .max(50, { message: "Brand name too long" })
    .optional()
    .default(""),
  category: z
    .enum([
      "fruits",
      "vegetables", 
      "grains",
      "proteins",
      "dairy",
      "nuts_seeds",
      "beverages",
      "snacks",
      "fast_food",
      "desserts",
      "oils_fats",
      "spices_herbs",
      "other"
    ], { message: "Invalid food category" }),
  servingSize: z
    .string()
    .min(1, { message: "Serving size is required" })
    .max(20, { message: "Serving size format too long" }),
  servingUnit: z
    .enum(["g", "ml", "cup", "piece", "slice", "tbsp", "tsp", "oz", "lb"], {
      message: "Invalid serving unit"
    })
    .default("g"),
  nutritionPer100g: z.object({
    calories: z
      .number()
      .min(0, { message: "Calories must be positive" })
      .max(1000, { message: "Calories per 100g too high" }),
    protein: z
      .number()
      .min(0, { message: "Protein must be positive" })
      .max(100, { message: "Protein per 100g too high" }),
    carbs: z
      .number()
      .min(0, { message: "Carbs must be positive" })
      .max(100, { message: "Carbs per 100g too high" }),
    fat: z
      .number()
      .min(0, { message: "Fat must be positive" })
      .max(100, { message: "Fat per 100g too high" }),
    fiber: z
      .number()
      .min(0, { message: "Fiber must be positive" })
      .max(50, { message: "Fiber per 100g too high" })
      .optional()
      .default(0),
    sugar: z
      .number()
      .min(0, { message: "Sugar must be positive" })
      .max(100, { message: "Sugar per 100g too high" })
      .optional()
      .default(0),
    sodium: z
      .number()
      .min(0, { message: "Sodium must be positive" })
      .max(5000, { message: "Sodium per 100g too high" })
      .optional()
      .default(0),
    cholesterol: z
      .number()
      .min(0, { message: "Cholesterol must be positive" })
      .max(1000, { message: "Cholesterol per 100g too high" })
      .optional()
      .default(0),
    saturatedFat: z
      .number()
      .min(0, { message: "Saturated fat must be positive" })
      .max(50, { message: "Saturated fat per 100g too high" })
      .optional()
      .default(0),
    transFat: z
      .number()
      .min(0, { message: "Trans fat must be positive" })
      .max(10, { message: "Trans fat per 100g too high" })
      .optional()
      .default(0)
  }),
  isPublic: z
    .boolean()
    .optional()
    .default(true),
  barcode: z
    .string()
    .max(20, { message: "Barcode too long" })
    .optional(),
  description: z
    .string()
    .max(1000, { message: "Description too long" })
    .optional(),
  tags: z
    .array(z.string().max(30, { message: "Tag too long" }))
    .max(10, { message: "Too many tags" })
    .optional()
    .default([])
});

export const updateFoodZodSchema = foodZodSchema.partial();

export const foodQueryZodSchema = z.object({
  search: z
    .string()
    .max(100, { message: "Search query too long" })
    .optional(),
  category: z
    .enum([
      "fruits",
      "vegetables", 
      "grains",
      "proteins",
      "dairy",
      "nuts_seeds",
      "beverages",
      "snacks",
      "fast_food",
      "desserts",
      "oils_fats",
      "spices_herbs",
      "other"
    ])
    .optional(),
  isVerified: z
    .string()
    .transform((val) => val === "true")
    .optional(),
  isPublic: z
    .string()
    .transform((val) => val === "true")
    .optional(),
  page: z
    .string()
    .transform((val) => parseInt(val))
    .refine((val) => val > 0, { message: "Page must be positive" })
    .optional()
    .default("1"),
  limit: z
    .string()
    .transform((val) => parseInt(val))
    .refine((val) => val > 0 && val <= 50, { message: "Limit must be between 1 and 50" })
    .optional()
    .default("20")
});

export const foodVerificationZodSchema = z.object({
  isVerified: z.boolean(),
  verificationNotes: z
    .string()
    .max(500, { message: "Verification notes too long" })
    .optional()
});
