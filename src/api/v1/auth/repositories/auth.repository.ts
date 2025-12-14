import { eq } from "drizzle-orm";
import { getDB } from "../../../../app/db/connectDB";
import { authUsers } from "../models/auth.model";
import { IAuthRepository } from "./auth.repository.interface";
import { kafkaProducer, UserCreatedEvent } from "../../../../app/kafka/producer";
import { IAuthEntity } from "../models/auth.entity";
import logger from "../../../../app/utils/logger";

export class AuthRepository implements IAuthRepository {

    async create(data: IAuthEntity): Promise<IAuthEntity | null> {
        try {
            const createdUsers = await getDB().transaction(async (tx) => {
                const [createdUser] = await tx
                    .insert(authUsers)
                    .values(data)
                    .returning();

                const event: UserCreatedEvent = {
                    id: data.id,
                    email: data.email,
                    username: data.username,
                    role: data.role,
                    status: data.status,
                    createdAt: data.createdAt,
                };

                // If Kafka fails, throw inside transaction → will rollback DB
                await kafkaProducer.publishUserCreated(event);

                return createdUser;
            });

            return createdUsers || null;
        } catch (err) {
            logger.error("❌ Failed to create user", err);
            return null;
        }
    }

    async findByEmail(email: string): Promise<IAuthEntity | null> {
        try {
            const [user] = await getDB()
                .select()
                .from(authUsers)
                .where(eq(authUsers.email, email));

            return user || null;
        } catch (err) {
            logger.error(`❌ Failed to find user by email: ${email}`, err);
            return null;
        }
    }

    async findByUsername(username: string): Promise<IAuthEntity | null> {
        try {
            const normalized = username.trim().toLowerCase();

            const [user] = await getDB()
                .select()
                .from(authUsers)
                .where(eq(authUsers.username, normalized));

            return user || null;
        } catch (err) {
            logger.error(`❌ Failed to find user by username: ${username}`, err);
            return null;
        }
    }

    async findById(id: string): Promise<IAuthEntity | null> {
        try {
            const [user] = await getDB()
                .select()
                .from(authUsers)
                .where(eq(authUsers.id, id));

            return user || null;
        } catch (err) {
            logger.error(`❌ Failed to find user by id: ${id}`, err);
            return null;
        }
    }

    async removeRefreshTokenById(id: string): Promise<IAuthEntity | null> {
        try {
            const [updated] = await getDB()
                .update(authUsers)
                .set({ refreshToken: null, updatedAt: new Date() })
                .where(eq(authUsers.id, id))
                .returning();

            return updated || null;
        } catch (err) {
            logger.error(`❌ Failed to remove refresh token for user id: ${id}`, err);
            return null;
        }
    }

    async updateById(
        id: string,
        data: Partial<IAuthEntity>
    ): Promise<IAuthEntity | null> {
        try {
            const [updated] = await getDB()
                .update(authUsers)
                .set({ ...data, updatedAt: new Date() })
                .where(eq(authUsers.id, id))
                .returning();

            return updated || null;
        } catch (err) {
            logger.error(`❌ Failed to update user id: ${id}`, err);
            return null;
        }
    }

    async deleteById(id: string): Promise<IAuthEntity | null> {
        try {
            const [deletedUser] = await getDB()
                .delete(authUsers)
                .where(eq(authUsers.id, id))
                .returning();

            return deletedUser || null;
        } catch (err) {
            logger.error(`❌ Failed to delete user id: ${id}`, err);
            return null;
        }
    }
}
