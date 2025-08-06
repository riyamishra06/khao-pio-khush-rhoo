import { z } from "zod";

export const loginZodSchema = z.object({
  username: z.string().optional(),
  email: z.string().email("Invalid email address"),
  password: z.string(),
  role: z.string().optional(),
});