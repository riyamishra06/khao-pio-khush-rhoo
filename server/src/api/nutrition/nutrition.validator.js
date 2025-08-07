import { z } from "zod";

export const nutritionEntryZodSchema = z.object({
  date: z
    .string()
    .refine((date) => !isNaN(Date.parse(date)), {
      message: "Invalid date format"
    }),
  foodItem: z
    .string()
    .min(1, { message: "Food item is required" })
    .max(100, { message: "Food item name too long" }),
  quantity: z
    .string()
    .min(1, { message: "Quantity is required" })
    .max(20, { message: "Quantity format too long" }),
  calories: z
    .number()
    .min(0, { message: "Calories must be positive" })
    .max(5000, { message: "Calories value too high" })
    .optional()
    .default(0),
  protein: z
    .number()
    .min(0, { message: "Protein must be positive" })
    .max(500, { message: "Protein value too high" })
    .optional()
    .default(0),
  carbs: z
    .number()
    .min(0, { message: "Carbs must be positive" })
    .max(800, { message: "Carbs value too high" })
    .optional()
    .default(0),
  fat: z
    .number()
    .min(0, { message: "Fat must be positive" })
    .max(300, { message: "Fat value too high" })
    .optional()
    .default(0),
  fiber: z
    .number()
    .min(0, { message: "Fiber must be positive" })
    .max(100, { message: "Fiber value too high" })
    .optional()
    .default(0),
  sugar: z
    .number()
    .min(0, { message: "Sugar must be positive" })
    .max(200, { message: "Sugar value too high" })
    .optional()
    .default(0),
  sodium: z
    .number()
    .min(0, { message: "Sodium must be positive" })
    .max(10000, { message: "Sodium value too high" })
    .optional()
    .default(0),
  mealType: z
    .enum(["breakfast", "lunch", "dinner", "snack"], {
      message: "Invalid meal type"
    })
    .optional()
    .default("snack"),
  foodId: z
    .string()
    .optional(),
  notes: z
    .string()
    .max(500, { message: "Notes too long" })
    .optional()
});

export const updateNutritionEntryZodSchema = nutritionEntryZodSchema.partial();

export const nutritionQueryZodSchema = z.object({
  date: z
    .string()
    .refine((date) => !isNaN(Date.parse(date)), {
      message: "Invalid date format"
    })
    .optional(),
  startDate: z
    .string()
    .refine((date) => !isNaN(Date.parse(date)), {
      message: "Invalid start date format"
    })
    .optional(),
  endDate: z
    .string()
    .refine((date) => !isNaN(Date.parse(date)), {
      message: "Invalid end date format"
    })
    .optional(),
  mealType: z
    .enum(["breakfast", "lunch", "dinner", "snack"])
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
    .refine((val) => val > 0 && val <= 100, { message: "Limit must be between 1 and 100" })
    .optional()
    .default("10")
});

export const dailySummaryQueryZodSchema = z.object({
  date: z
    .string()
    .refine((date) => !isNaN(Date.parse(date)), {
      message: "Invalid date format"
    }),
});

export const nutritionStatsQueryZodSchema = z.object({
  period: z
    .enum(["week", "month", "3months", "6months", "year"])
    .optional()
    .default("month"),
  startDate: z
    .string()
    .refine((date) => !isNaN(Date.parse(date)), {
      message: "Invalid start date format"
    })
    .optional(),
  endDate: z
    .string()
    .refine((date) => !isNaN(Date.parse(date)), {
      message: "Invalid end date format"
    })
    .optional()
});
