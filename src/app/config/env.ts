import { z } from "zod";
import { Environment, LogLevel } from "./constants";

// Define & validate environment schema
const envSchema = z.object({
    // ------------------------
    // Server
    // ------------------------
    NODE_ENV: z.enum(Environment).default(Environment.DEVELOPMENT),
    PORT: z.string().regex(/^\d+$/, "PORT must be a number").default("5000"),
    CORS_ORIGIN: z.string(),

    // ------------------------
    // Database (PostgreSQL)
    // ------------------------
    POSTGRES_USER: z.string(),
    POSTGRES_PASSWORD: z.string(),
    POSTGRES_DB: z.string(),
    POSTGRES_HOST: z.string(),
    POSTGRES_PORT: z.string().regex(/^\d+$/, "POSTGRES_PORT must be a number"),
    DATABASE_URL: z.string().url(),

    // ------------------------
    // JWT
    // ------------------------
    ACCESS_TOKEN_SECRET: z.string().min(8),
    ACCESS_TOKEN_EXPIRY: z.string(),
    REFRESH_TOKEN_SECRET: z.string().min(8),
    REFRESH_TOKEN_EXPIRY: z.string(),

    // ------------------------
    // Logging
    // ------------------------
    LOG_LEVEL: z.enum(LogLevel).default(LogLevel.DEBUG),

    // ------------------------
    // Cloudinary (optional)
    // ------------------------
    CLOUDINARY_CLOUD_NAME: z.string().optional(),
    CLOUDINARY_API_KEY: z.string().optional(),
    CLOUDINARY_API_SECRET: z.string().optional(),

    // ------------------------
    // Redis (optional)
    // ------------------------
    REDIS_HOST: z.string().optional(),
    REDIS_PORT: z.string().optional(),
    REDIS_PASSWORD: z.string().optional(),
    REDIS_URL: z.string().optional(),


});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
    console.error("Invalid environment configuration:");
    console.error(parsed.error.format());
    process.exit(1);
}

export const env = parsed.data;

// constants
export const isProduction = env.NODE_ENV === Environment.PRODUCTION;
export const isDevelopment = env.NODE_ENV === Environment.DEVELOPMENT;
export const isTest = env.NODE_ENV === Environment.TEST;

// Log startup configuration summary
console.info(
    `🌍 Environment initialized: ${env.NODE_ENV} | Port: ${env.PORT} | Log level: ${env.LOG_LEVEL}`
);
