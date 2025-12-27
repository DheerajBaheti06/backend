import { z } from "zod";

export const userRegisterschema = z.object({
  fullName: z.string().min(3, "Full name must be at least 3 characters long"),
  email: z.string().email("Invalid email address"),
  username: z.string().min(3, "Username must be at least 3 characters long"),
  password: z.string().min(8, "Password must be at least 8 characters long"),
});

export const userLoginSchema = z
  .object({
    email: z.string().optional(),
    username: z.string().optional(),
    password: z.string().min(8, "Password is required"),
  })
  .refine((data) => data.email || data.username, {
    message: "Email or username is required",
    path: ["username"],
  });

export const changePasswordSchema = z.object({
  oldPassword: z.string().min(1, "Old password is required"),
  newPassword: z
    .string()
    .min(8, "New password must be at least 8 characters long"),
});

export const updateAccountSchema = z.object({
  fullName: z.string().min(3, "Full name must be at least 3 characters long"),
  email: z.string().email("Invalid email address"),
});
