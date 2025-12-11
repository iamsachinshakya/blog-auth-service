import { eq } from "drizzle-orm";
import { IAuthUserEntity } from "../models/auth.entity";
import { getDB } from "../../../../app/db/connectDB";
import { authUsers } from "../models/auth.model";
import { IAuthRepository } from "./auth.repository.interface";

export class AuthRepository implements IAuthRepository {

    /* -------------------------------------------------------
        CREATE USER
    --------------------------------------------------------*/
    async create(data: IAuthUserEntity): Promise<IAuthUserEntity | null> {
        const [user] = await getDB()
            .insert(authUsers)
            .values(data)
            .returning();

        return user || null;
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
}
