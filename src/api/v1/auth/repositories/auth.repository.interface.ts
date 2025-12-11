import { IAuthUserEntity } from "../models/auth.entity";

export interface IAuthRepository {
    findByEmail(email: string): Promise<IAuthUserEntity | null>;
    findByUsername(username: string): Promise<IAuthUserEntity | null>;
    findById(id: string): Promise<IAuthUserEntity | null>;
    create(data: IAuthUserEntity): Promise<IAuthUserEntity | null>;
    removeRefreshTokenById(id: string): Promise<IAuthUserEntity | null>;
    updateById(
        id: string,
        data: Partial<IAuthUserEntity>
    ): Promise<IAuthUserEntity | null>
}
