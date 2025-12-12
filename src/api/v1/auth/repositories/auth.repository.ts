import { eq } from "drizzle-orm";
import { IAuthUserEntity } from "../models/auth.entity";
import { getDB } from "../../../../app/db/connectDB";
import { authUsers } from "../models/auth.model";
import { IAuthRepository } from "./auth.repository.interface";
import { kafkaProducer, UserCreatedEvent } from "../../../../app/kafka/producer";

export class AuthRepository implements IAuthRepository {

    /* -------------------------------------------------------
        CREATE USER
    --------------------------------------------------------*/
    async create(data: IAuthUserEntity): Promise<IAuthUserEntity | null> {
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

            return createdUser; // return from transaction callback
        });

        return createdUsers || null; // return from function
    }


    /* -------------------------------------------------------
        FIND BY EMAIL
    --------------------------------------------------------*/
    async findByEmail(email: string): Promise<IAuthUserEntity | null> {
        const [user] = await getDB()
            .select()
            .from(authUsers)
            .where(eq(authUsers.email, email));

        return user || null;
    }

    /* -------------------------------------------------------
        FIND BY USERNAME
    --------------------------------------------------------*/
    async findByUsername(username: string): Promise<IAuthUserEntity | null> {
        const normalized = username.trim().toLowerCase();

        const [user] = await getDB()
            .select()
            .from(authUsers)
            .where(eq(authUsers.username, normalized));

        return user || null;
    }

    /* -------------------------------------------------------
        FIND BY ID
    --------------------------------------------------------*/
    async findById(id: string): Promise<IAuthUserEntity | null> {
        const [user] = await getDB()
            .select()
            .from(authUsers)
            .where(eq(authUsers.id, id));

        return user || null;
    }

    /* -------------------------------------------------------
        REMOVE REFRESH TOKEN
    --------------------------------------------------------*/
    async removeRefreshTokenById(id: string): Promise<IAuthUserEntity | null> {
        const [updated] = await getDB()
            .update(authUsers)
            .set({ refreshToken: null, updatedAt: new Date() }) // clear refresh token
            .where(eq(authUsers.id, id))
            .returning();

        return updated || null;
    }

    /* -------------------------------------------------------
       UPDATE USER BY ID (Generic)
   --------------------------------------------------------*/
    async updateById(
        id: string,
        data: Partial<IAuthUserEntity>
    ): Promise<IAuthUserEntity | null> {
        const [updated] = await getDB()
            .update(authUsers)
            .set({ ...data, updatedAt: new Date() }) // always update `updatedAt`
            .where(eq(authUsers.id, id))
            .returning();

        return updated || null;
    }

    /* -------------------------------------------------------
    DELETE USER BY ID
--------------------------------------------------------*/
    async deleteById(id: string): Promise<IAuthUserEntity | null> {
        const [deletedUser] = await getDB()
            .delete(authUsers)
            .where(eq(authUsers.id, id))
            .returning(); // return the deleted row if needed

        return deletedUser || null;
    }
}
