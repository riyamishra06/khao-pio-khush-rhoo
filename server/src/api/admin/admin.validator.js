import { z } from "zod";

export const userQueryZodSchema = z.object({
  search: z
    .string()
    .max(100, { message: "Search query too long" })
    .optional(),
  role: z
    .enum(["user", "admin"])
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
    .default("20")
});

export const updateUserZodSchema = z.object({
  username: z
    .string()
    .min(3, { message: "Username must be at least 3 characters" })
    .max(50, { message: "Username too long" })
    .optional(),
  email: z
    .string()
    .email({ message: "Invalid email address" })
    .optional(),
  role: z
    .enum(["user", "admin"])
    .optional()
});

export const adminStatsQueryZodSchema = z.object({
  startDate: z
    .string()
    .datetime({ message: "Invalid start date format" })
    .optional(),
  endDate: z
    .string()
    .datetime({ message: "Invalid end date format" })
    .optional()
});
