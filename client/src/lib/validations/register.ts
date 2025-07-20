import { z } from "zod";

export const registerSchema = z
  .object({
    name: z.string().min(3, "Username must be at least 3 characters"),
    email: z.email("Enter a valid email").min(1, "Email is required"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(6, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Password do not match",
    path: ["confirmPassword"],
  });

export type RegisterSchema = z.infer<typeof registerSchema>;
