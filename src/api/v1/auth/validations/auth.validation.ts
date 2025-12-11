import { z } from "zod";

export const registerUserSchema = z.object({
    fullName: z
        .string()
        .nonempty("Full name is required")
        .trim()
        .min(3, "Full name must be at least 3 characters long")
        .max(50, "Full name must be at most 50 characters long"),

    username: z
        .string()
        .nonempty("Username is required")
        .trim()
        .toLowerCase()
        .min(3, "Username must be at least 3 characters long")
        .max(20, "Username must be at most 20 characters long")
        .regex(
            /^[a-z0-9_]+$/,
            "Username can only contain lowercase letters, numbers, and underscores"
        ),

    email: z
        .string()
        .nonempty("Email is required")
        .trim()
        .email("Invalid email address"),

    password: z
        .string()
        .nonempty("Password is required")
        .min(8, "Password must be at least 8 characters long")
        .max(64, "Password must be at most 64 characters long")
        .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
        .regex(/[a-z]/, "Password must contain at least one lowercase letter")
        .regex(/[0-9]/, "Password must contain at least one number")
        .regex(/[@$!%*?&#]/, "Password must contain at least one special character (@$!%*?&#)"),
});


export const loginUserSchema = z.object({
    email: z
        .string()
        .nonempty("Email is required")
        .trim()
        .email("Invalid email address"),

    password: z
        .string()
        .nonempty("Password is required")
        .min(8, "Password must be at least 8 characters long")
        .max(64, "Password must be at most 64 characters long")
        .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
        .regex(/[a-z]/, "Password must contain at least one lowercase letter")
        .regex(/[0-9]/, "Password must contain at least one number")
        .regex(/[@$!%*?&#]/, "Password must contain at least one special character (@$!%*?&#)"),
});


export const updatePasswordSchema = z.object({
    newPassword: z
        .string()
        .nonempty("Password is required")
        .min(8, "Password must be at least 8 characters long")
        .max(64, "Password must be at most 64 characters long")
        .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
        .regex(/[a-z]/, "Password must contain at least one lowercase letter")
        .regex(/[0-9]/, "Password must contain at least one number")
        .regex(/[@$!%*?&#]/, "Password must contain at least one special character (@$!%*?&#)"),
});
