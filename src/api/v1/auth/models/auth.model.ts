import {
    pgTable,
    serial,
    text,
    varchar,
    boolean,
    timestamp,
    jsonb
} from "drizzle-orm/pg-core";
import { UserRole, UserStatus } from "./auth.entity";

export const authUsers = pgTable("authUsers", {
    id: serial("id").primaryKey(),
    email: varchar("email", { length: 255 }).notNull(),
    password: text("password").notNull(),

    role: text("role")
        .$type<UserRole>()
        .default(UserRole.USER)
        .notNull(),

    status: text("status")
        .$type<UserStatus>()
        .default(UserStatus.ACTIVE)
        .notNull(),

    refreshToken: text("refresh_token"),

    /** ----- TIMESTAMPS ----- */
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
    lastLogin: timestamp("last_login"),
});
