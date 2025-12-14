import { IChangePassword, ILoginCredentials, IRegisterData } from "../models/auth.dto";
import { IAuthEntity } from "../models/auth.entity";

export interface IAuthService {
    registerUser(
        data: IRegisterData
    ): Promise<IAuthEntity>;

    loginUser(data: ILoginCredentials): Promise<{ user: IAuthEntity; accessToken: string; refreshToken: string }>;

    logoutUser(userId: string): Promise<IAuthEntity | null>;

    refreshAccessToken(
        incomingRefreshToken: string
    ): Promise<{ accessToken: string }>;

    changeUserPassword(data: IChangePassword, userId: string): Promise<void>;
}
