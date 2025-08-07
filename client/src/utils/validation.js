import { z } from 'zod';

// Auth validation schemas
export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
  role: z.enum(['user', 'admin'], 'Role must be either user or admin'),
});

export const registerSchema = z.object({
  username: z.string()
    .min(3, 'Username must be at least 3 characters')
    .max(50, 'Username must be less than 50 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 
      'Password must contain at least one uppercase letter, one lowercase letter, and one number'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

// User profile validation schema
export const profileSchema = z.object({
  username: z.string()
    .min(3, 'Username must be at least 3 characters')
    .max(50, 'Username must be less than 50 characters'),
  email: z.string().email('Invalid email address'),
});

// Nutrition goals validation schema
export const nutritionGoalsSchema = z.object({
  dailyCalories: z.number()
    .min(800, 'Daily calories must be at least 800')
    .max(5000, 'Daily calories must be less than 5000'),
  dailyProtein: z.number()
    .min(10, 'Daily protein must be at least 10g')
    .max(500, 'Daily protein must be less than 500g'),
  dailyCarbs: z.number()
    .min(20, 'Daily carbs must be at least 20g')
    .max(800, 'Daily carbs must be less than 800g'),
  dailyFat: z.number()
    .min(10, 'Daily fat must be at least 10g')
    .max(300, 'Daily fat must be less than 300g'),
  dailyFiber: z.number()
    .min(0, 'Daily fiber cannot be negative')
    .max(100, 'Daily fiber must be less than 100g')
    .optional(),
  dailySugar: z.number()
    .min(0, 'Daily sugar cannot be negative')
    .max(200, 'Daily sugar must be less than 200g')
    .optional(),
  dailySodium: z.number()
    .min(0, 'Daily sodium cannot be negative')
    .max(10000, 'Daily sodium must be less than 10000mg')
    .optional(),
});

// Food validation schema
export const foodSchema = z.object({
  name: z.string()
    .min(1, 'Food name is required')
    .max(100, 'Food name must be less than 100 characters'),
  brand: z.string()
    .max(50, 'Brand name must be less than 50 characters')
    .optional(),
  category: z.enum([
    'fruits', 'vegetables', 'grains', 'proteins', 'dairy',
    'nuts_seeds', 'beverages', 'snacks', 'fast_food', 'desserts',
    'oils_fats', 'spices_herbs', 'other'
  ], 'Invalid food category'),
  servingSize: z.string()
    .min(1, 'Serving size is required')
    .max(20, 'Serving size must be less than 20 characters'),
  servingUnit: z.enum(['g', 'ml', 'cup', 'piece', 'slice', 'tbsp', 'tsp', 'oz', 'lb'], 
    'Invalid serving unit'),
  nutritionPer100g: z.object({
    calories: z.number()
      .min(0, 'Calories cannot be negative')
      .max(1000, 'Calories per 100g seems too high'),
    protein: z.number()
      .min(0, 'Protein cannot be negative')
      .max(100, 'Protein per 100g seems too high'),
    carbs: z.number()
      .min(0, 'Carbs cannot be negative')
      .max(100, 'Carbs per 100g seems too high'),
    fat: z.number()
      .min(0, 'Fat cannot be negative')
      .max(100, 'Fat per 100g seems too high'),
    fiber: z.number()
      .min(0, 'Fiber cannot be negative')
      .max(50, 'Fiber per 100g seems too high')
      .optional(),
    sugar: z.number()
      .min(0, 'Sugar cannot be negative')
      .max(100, 'Sugar per 100g seems too high')
      .optional(),
    sodium: z.number()
      .min(0, 'Sodium cannot be negative')
      .max(5000, 'Sodium per 100g seems too high')
      .optional(),
  }),
  description: z.string()
    .max(1000, 'Description must be less than 1000 characters')
    .optional(),
  tags: z.array(z.string().max(30, 'Tag must be less than 30 characters'))
    .max(10, 'Maximum 10 tags allowed')
    .optional(),
});

// Nutrition entry validation schema
export const nutritionEntrySchema = z.object({
  date: z.string().min(1, 'Date is required'),
  foodItem: z.string()
    .min(1, 'Food item is required')
    .max(100, 'Food item name must be less than 100 characters'),
  quantity: z.string()
    .min(1, 'Quantity is required')
    .max(50, 'Quantity must be less than 50 characters'),
  calories: z.number()
    .min(0, 'Calories cannot be negative')
    .max(10000, 'Calories seems too high'),
  protein: z.number()
    .min(0, 'Protein cannot be negative')
    .max(1000, 'Protein seems too high'),
  carbs: z.number()
    .min(0, 'Carbs cannot be negative')
    .max(1000, 'Carbs seems too high'),
  fat: z.number()
    .min(0, 'Fat cannot be negative')
    .max(1000, 'Fat seems too high'),
  fiber: z.number()
    .min(0, 'Fiber cannot be negative')
    .max(200, 'Fiber seems too high')
    .optional(),
  sugar: z.number()
    .min(0, 'Sugar cannot be negative')
    .max(500, 'Sugar seems too high')
    .optional(),
  sodium: z.number()
    .min(0, 'Sodium cannot be negative')
    .max(50000, 'Sodium seems too high')
    .optional(),
  mealType: z.enum(['breakfast', 'lunch', 'dinner', 'snack'], 
    'Invalid meal type'),
  notes: z.string()
    .max(500, 'Notes must be less than 500 characters')
    .optional(),
});

// Date range validation schema
export const dateRangeSchema = z.object({
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().min(1, 'End date is required'),
}).refine((data) => {
  const start = new Date(data.startDate);
  const end = new Date(data.endDate);
  return start <= end;
}, {
  message: "End date must be after start date",
  path: ["endDate"],
});

// Search validation schema
export const searchSchema = z.object({
  query: z.string()
    .min(2, 'Search query must be at least 2 characters')
    .max(100, 'Search query must be less than 100 characters'),
});

// Pagination validation schema
export const paginationSchema = z.object({
  page: z.number().min(1, 'Page must be at least 1'),
  limit: z.number().min(1, 'Limit must be at least 1').max(100, 'Limit must be less than 100'),
});

// Helper function to validate data
export const validateData = (schema, data) => {
  try {
    return {
      success: true,
      data: schema.parse(data),
      errors: null,
    };
  } catch (error) {
    return {
      success: false,
      data: null,
      errors: error.errors,
    };
  }
};

// Helper function to format validation errors
export const formatValidationErrors = (errors) => {
  if (!errors || !Array.isArray(errors)) return {};
  
  return errors.reduce((acc, error) => {
    const path = error.path.join('.');
    acc[path] = error.message;
    return acc;
  }, {});
};
