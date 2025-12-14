import { IAuthEntity } from "../models/auth.entity";

export interface IAuthRepository {
    findByEmail(email: string): Promise<IAuthEntity | null>;
    findByUsername(username: string): Promise<IAuthEntity | null>;
    findById(id: string): Promise<IAuthEntity | null>;
    create(data: IAuthEntity): Promise<IAuthEntity | null>;
    removeRefreshTokenById(id: string): Promise<IAuthEntity | null>;
    updateById(
        id: string,
        data: Partial<IAuthEntity>
    ): Promise<IAuthEntity | null>;
    deleteById(id: string): Promise<IAuthEntity | null>;
}
