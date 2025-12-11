import { defineConfig } from "drizzle-kit";
import { env } from "./src/app/config/env";

export default defineConfig({
    dialect: 'postgresql',
    schema: './src/app/db/postgres/schema.ts',
    out: './src/app/db/postgres/drizzle',
    dbCredentials: {
        url: process.env.POSTGRES_URI || env.POSTGRES_URI,
    },
});

