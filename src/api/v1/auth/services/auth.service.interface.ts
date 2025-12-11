import { IAuthUser, IChangePassword, ILoginCredentials, IRegisterData } from "../models/auth.dto";
import { IAuthUserEntity } from "../models/auth.entity";

export interface IAuthService {
    registerUser(
        data: IRegisterData
    ): Promise<IAuthUser>;

    loginUser(data: ILoginCredentials): Promise<{ user: IAuthUserEntity; accessToken: string; refreshToken: string }>;

    logoutUser(userId: string): Promise<IAuthUserEntity | null>;

    refreshAccessToken(
        incomingRefreshToken: string
    ): Promise<{ accessToken: string }>;

    changeUserPassword(data: IChangePassword, userId: string): Promise<void>;
}
