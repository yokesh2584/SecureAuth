import { z } from "zod";

export const loginSchema = z.object({
  email: z.email("Enter a valid email").min(1, "Email is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  rememberMe: z.union([z.literal("on"), z.boolean()]).optional(),
});

export type LoginSchema = z.infer<typeof loginSchema>;
