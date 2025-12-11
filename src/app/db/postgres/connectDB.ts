import postgres from "postgres";
import { drizzle, PostgresJsDatabase } from "drizzle-orm/postgres-js";
import logger from "../../utils/logger";
import { env } from "../../config/env";
import * as schema from "./schema";

let db: PostgresJsDatabase<typeof schema> | null = null;
let client: postgres.Sql | null = null;

export const connectDB = async (): Promise<PostgresJsDatabase<typeof schema>> => {
    if (db) {
        logger.debug("⚡ PostgreSQL already initialized — skipping reconnect.");
        return db;
    }

    try {
        const POSTGRES_URL = env.POSTGRES_URI;
        if (!POSTGRES_URL) throw new Error("POSTGRES_URI is missing in .env");

        // Create postgres.js client (handles connection pooling internally)
        client = postgres(POSTGRES_URL, {
            max: 10, // Connection pool size
            idle_timeout: 30, // Idle timeout in seconds
            connect_timeout: 10, // Connection timeout in seconds
            prepare: false, // Required for Supabase transaction pooling mode
            ssl: { rejectUnauthorized: false }, // Needed for Supabase
            onnotice: () => { }, // Suppress notices (optional)
        });

        // Test connection
        await client`SELECT 1`;

        // Initialize Drizzle ORM with schema
        db = drizzle(client, { schema });

        logger.info("🐘 PostgreSQL connected");
        logger.debug(`🔌 DB URL: ${POSTGRES_URL}`);

        return db;
    } catch (err: any) {
        logger.error(`❌ Failed to connect PostgreSQL: ${err.message}`);
        throw err;
    }
};

export const getDB = (): PostgresJsDatabase<typeof schema> => {
    if (!db) throw new Error("❌ Database not initialized. Call connectDB() first.");
    return db;
};

// Graceful shutdown helper
export const closeDB = async (): Promise<void> => {
    if (client) {
        await client.end();
        logger.info("🔌 PostgreSQL connection closed");
        db = null;
        client = null;
    }
};
