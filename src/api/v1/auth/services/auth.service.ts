import { env } from "../../../../app/config/env";
import { ErrorCode } from "../../common/constants/errorCodes";
import { ApiError } from "../../common/utils/apiError";
import { IChangePassword, ILoginCredentials, IRegisterData } from "../models/auth.dto";
import { IAuthUserEntity } from "../models/auth.entity";
import { comparePassword, hashPassword } from "../utils/bcrypt.util";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyToken,
} from "../utils/jwt.util";
import { IAuthService } from "./auth.service.interface";

export class AuthService implements IAuthService {

  /* -------------------------------------------------------
     REGISTER USER
  --------------------------------------------------------*/
  async registerUser(data: IRegisterData): Promise<IAuthUserEntity> {
    const { email, username, password, role } = data;

    // const isUsernameExist =
    //   await RepositoryProvider.userRepository.findByUsername(username);

    // console.log("Checking if username exists:", isUsernameExist);

    // if (isUsernameExist) {
    //   throw new ApiError(
    //     "Username already exists",
    //     409,
    //     ErrorCode.USER_ALREADY_EXISTS
    //   );
    // }


    // const isEmailExist =
    //   await RepositoryProvider.userRepository.findByEmail(email);

    // if (isEmailExist) {
    //   throw new ApiError(
    //     "Email already exists",
    //     409,
    //     ErrorCode.USER_ALREADY_EXISTS
    //   );
    // }

    const hashedPassword = await hashPassword(password);
    if (!hashedPassword) {
      throw new ApiError(
        "Failed to hash password",
        500,
        ErrorCode.PASSWORD_HASH_FAILED
      );
    }

    // const registeredUser = await RepositoryProvider.userRepository.create({
    //   fullName,
    //   email,
    //   username: username.toLowerCase(),
    //   password: hashedPassword,
    // });

    // if (!registeredUser) {
    //   throw new ApiError(
    //     "User registration failed",
    //     500,
    //     ErrorCode.USER_REGISTRATION_FAILED
    //   );
    // }
    // return registeredUser;
    return {} as IAuthUserEntity;
  }


  /* -------------------------------------------------------
     LOGIN USER
  --------------------------------------------------------*/
  async loginUser(data: ILoginCredentials): Promise<{ user: IAuthUserEntity; accessToken: string; refreshToken: string }> {
    const { email, password } = data;
    if (!email?.trim() || !password?.trim()) {
      throw new ApiError(
        "Email and password are required",
        400,
        ErrorCode.VALIDATION_ERROR
      );
    }

    // const user = await RepositoryProvider.userRepository.findByEmail(email, true);
    // if (!user) throw new ApiError("User not found", 404, ErrorCode.USER_NOT_FOUND);
    // if (!user.password) throw new ApiError("User password missing in database", 500, ErrorCode.INTERNAL_SERVER_ERROR);
    // if (user.status === UserStatus.INACTIVE) throw new ApiError("User account is inactive", 403, ErrorCode.USER_INACTIVE);


    // const isPasswordValid = await comparePassword(password, user.password);
    // if (!isPasswordValid) throw new ApiError("Invalid credentials", 401, ErrorCode.INVALID_CREDENTIALS);


    // const tokens = await this.generateTokenAndAddToUser(user.id);
    // const updatedUser = await RepositoryProvider.userRepository.findById(user.id);

    // if (!updatedUser) throw new ApiError("User not found after login", 404, ErrorCode.USER_NOT_FOUND);
    // return { user: updatedUser, ...tokens };
    return { user: {} as IAuthUserEntity, accessToken: "", refreshToken: "" };
  }

  /* -------------------------------------------------------
     LOGOUT USER
  --------------------------------------------------------*/
  async logoutUser(userId: string): Promise<IAuthUserEntity | null> {
    if (!userId) throw new ApiError("User ID is required", 400, ErrorCode.VALIDATION_ERROR);
    // return await RepositoryProvider.userRepository.removeRefreshTokenById(userId);
    return null;
  }

  /* -------------------------------------------------------
     REFRESH ACCESS TOKEN
  --------------------------------------------------------*/
  async refreshAccessToken(
    incomingRefreshToken: string
  ): Promise<{ accessToken: string }> {

    //  Missing token
    if (!incomingRefreshToken) throw new ApiError("Refresh token missing", 401, ErrorCode.REFRESH_TOKEN_MISSING);

    // Verify token signature + payload structure
    const decoded = verifyToken(
      incomingRefreshToken,
      env.REFRESH_TOKEN_SECRET
    );

    if (!decoded || !decoded.id) throw new ApiError("Invalid refresh token payload", 401, ErrorCode.TOKEN_INVALID);

    // Make sure user exists
    // const user = await RepositoryProvider.userRepository.findById(decoded.id, true);
    // if (!user) {
    //   throw new ApiError(
    //     "Invalid refresh token - user not found",
    //     401,
    //     ErrorCode.TOKEN_INVALID
    //   );
    // }

    // // Validate refresh token stored in DB
    // if (incomingRefreshToken !== user.refreshToken) {
    //   throw new ApiError(
    //     "Refresh token expired or does not match stored token",
    //     401,
    //     ErrorCode.REFRESH_TOKEN_MISMATCH
    //   );
    // }

    // // Create new access token only
    // const payload: IAuthUser = {
    //   id: user.id,
    //   email: user.email,
    //   username: user.username,
    //   fullName: user.fullName,
    //   role: user.role,
    //   status: user.status
    // };

    // const accessToken = generateAccessToken(payload);

    return { accessToken: "" };
  }


  /* -------------------------------------------------------
     CHANGE PASSWORD
  --------------------------------------------------------*/
  async changeUserPassword(data: IChangePassword, userId: string): Promise<void> {
    const { oldPassword, newPassword } = data;
    // const user = await RepositoryProvider.userRepository.findById(userId, true);
    // if (!user) {
    //   throw new ApiError("User not found!", 404, ErrorCode.USER_NOT_FOUND);
    // }

    // if (!user.password) {
    //   throw new ApiError(
    //     "Password missing in DB",
    //     500,
    //     ErrorCode.INTERNAL_SERVER_ERROR
    //   );
    // }

    // const isPasswordValid = await comparePassword(oldPassword, user.password);
    // if (!isPasswordValid) {
    //   throw new ApiError("Invalid credentials", 401, ErrorCode.INVALID_CREDENTIALS);
    // }

    // const hashedPassword = await hashPassword(newPassword);
    // if (!hashedPassword) {
    //   throw new ApiError(
    //     "Failed to hash new password",
    //     500,
    //     ErrorCode.PASSWORD_HASH_FAILED
    //   );
    // }

    // await RepositoryProvider.userRepository.updateById(user.id, {
    //   password: hashedPassword,
    // });
    return;
  }

  /* -------------------------------------------------------
   GENERATE ACCESS + REFRESH TOKENS
--------------------------------------------------------*/
  private async generateTokenAndAddToUser(
    userId: string
  ): Promise<{ accessToken: string; refreshToken: string }> {
    // const user = await RepositoryProvider.userRepository.findById(userId);
    // if (!user) {
    //   throw new ApiError("User not found", 404, ErrorCode.USER_NOT_FOUND);
    // }

    // const payload: IAuthUser = {
    //   id: user.id,
    //   email: user.email,
    //   username: user.username,
    //   fullName: user.fullName,
    //   role: user.role,
    //   status: user.status
    // };

    // const accessToken = generateAccessToken(payload);
    // const refreshToken = generateRefreshToken({ id: user.id });

    // await RepositoryProvider.userRepository.updateById(user.id, { refreshToken });

    return { accessToken: "", refreshToken: "" };
  }
}
