import { env } from "../../../../app/config/env";
import { ErrorCode } from "../../common/constants/errorCodes";
import { ApiError } from "../../common/utils/apiError";
import { getUID } from "../../common/utils/common.util";
import {
  IAuthUser,
  IChangePassword,
  ILoginCredentials,
  IRegisterData
} from "../models/auth.dto";
import { IAuthUserEntity, UserRole, UserStatus } from "../models/auth.entity";
import { IAuthRepository } from "../repositories/auth.repository.interface";
import { comparePassword, hashPassword } from "../utils/bcrypt.util";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyToken
} from "../utils/jwt.util";
import { IAuthService } from "./auth.service.interface";

export class AuthService implements IAuthService {
  constructor(private readonly authRepo: IAuthRepository) { }

  /* -------------------------------------------------------
      REGISTER USER
  --------------------------------------------------------*/

  async registerUser(data: IRegisterData): Promise<IAuthUserEntity> {
    const { email, username, password, role } = data;

    if (!email || !username || !password) {
      throw new ApiError(
        "Full name, email, username, and password are required",
        400,
        ErrorCode.VALIDATION_ERROR
      );
    }

    // check email exists
    if (await this.authRepo.findByEmail(email)) {
      throw new ApiError(
        "Email already exists",
        409,
        ErrorCode.USER_ALREADY_EXISTS
      );
    }

    // check username exists
    if (await this.authRepo.findByUsername(username)) {
      throw new ApiError(
        "Username already exists",
        409,
        ErrorCode.USER_ALREADY_EXISTS
      );
    }

    const hashedPassword = await hashPassword(password);
    if (!hashedPassword) {
      throw new ApiError(
        "Failed to hash password",
        500,
        ErrorCode.PASSWORD_HASH_FAILED
      );
    }

    const newUser: IAuthUserEntity = {
      id: getUID(),
      email,
      username: username.toLowerCase(),
      password: hashedPassword,
      role: role || UserRole.USER,
      refreshToken: null,
      status: UserStatus.ACTIVE,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const createdUser = await this.authRepo.create(newUser);
    if (!createdUser) {
      throw new ApiError(
        "User registration failed",
        500,
        ErrorCode.USER_REGISTRATION_FAILED
      );
    }

    return this.toEntity(createdUser); // sanitize before returning
  }


  /* -------------------------------------------------------
      LOGIN USER
  --------------------------------------------------------*/
  async loginUser(
    data: ILoginCredentials
  ): Promise<{ user: IAuthUserEntity; accessToken: string; refreshToken: string }> {
    const { email, password } = data;

    if (!email || !password) {
      throw new ApiError(
        "Email and password are required",
        400,
        ErrorCode.VALIDATION_ERROR
      );
    }

    const user = await this.authRepo.findByEmail(email);
    if (!user) throw new ApiError("User not found", 404, ErrorCode.USER_NOT_FOUND);
    if (!user.password) throw new ApiError("User password missing", 500, ErrorCode.INTERNAL_SERVER_ERROR);

    if (!(await comparePassword(password, user.password))) {
      throw new ApiError("Invalid credentials", 401, ErrorCode.INVALID_CREDENTIALS);
    }

    const tokens = await this.generateTokenAndAddToUser(user.id);

    // fetch updated user (with refresh token)
    const updatedUser = await this.authRepo.findById(user.id);
    if (!updatedUser) throw new ApiError("User not found after login", 404, ErrorCode.USER_NOT_FOUND);

    return {
      user: this.toEntity(updatedUser),
      ...tokens
    };
  }

  /* -------------------------------------------------------
      LOGOUT USER
  --------------------------------------------------------*/
  async logoutUser(userId: string): Promise<IAuthUserEntity | null> {
    if (!userId) throw new ApiError("User ID is required", 400, ErrorCode.VALIDATION_ERROR);

    const user = await this.authRepo.removeRefreshTokenById(userId);
    return this.toEntity(user, true);
  }

  /* -------------------------------------------------------
      REFRESH ACCESS TOKEN
  --------------------------------------------------------*/
  async refreshAccessToken(incomingRefreshToken: string): Promise<{ accessToken: string }> {
    if (!incomingRefreshToken) throw new ApiError("Refresh token missing", 401, ErrorCode.REFRESH_TOKEN_MISSING);

    const decoded = verifyToken(incomingRefreshToken, env.REFRESH_TOKEN_SECRET);
    if (!decoded?.id) throw new ApiError("Invalid refresh token", 401, ErrorCode.TOKEN_INVALID);

    const user = await this.authRepo.findById(decoded.id);
    if (!user) throw new ApiError("User not found", 401, ErrorCode.TOKEN_INVALID);
    if (incomingRefreshToken !== user.refreshToken) {
      throw new ApiError("Refresh token mismatch or expired", 401, ErrorCode.REFRESH_TOKEN_MISMATCH);
    }

    const payload: IAuthUser = {
      id: user.id,
      email: user.email,
      role: user.role,
      status: user.status
    };

    return { accessToken: generateAccessToken(payload) };
  }

  /* -------------------------------------------------------
      CHANGE PASSWORD
  --------------------------------------------------------*/
  async changeUserPassword(data: IChangePassword, userId: string): Promise<void> {
    const { oldPassword, newPassword } = data;

    const user = await this.authRepo.findById(userId);
    if (!user || !user.password) throw new ApiError("User not found or invalid", 404, ErrorCode.USER_NOT_FOUND);

    if (!(await comparePassword(oldPassword, user.password))) {
      throw new ApiError("Invalid credentials", 401, ErrorCode.INVALID_CREDENTIALS);
    }

    const hashed = await hashPassword(newPassword);
    if (!hashed) throw new ApiError("Password hashing failed", 500, ErrorCode.PASSWORD_HASH_FAILED);

    await this.authRepo.updateById(user.id, { password: hashed });
  }

  /* -------------------------------------------------------
      GENERATE TOKENS + SAVE REFRESH TOKEN
  --------------------------------------------------------*/
  private async generateTokenAndAddToUser(
    userId: string
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const user = await this.authRepo.findById(userId);
    if (!user) throw new ApiError("User not found", 404, ErrorCode.USER_NOT_FOUND);

    const payload: IAuthUser = {
      id: user.id,
      email: user.email,
      role: user.role,
      status: user.status
    };

    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken({ id: user.id });

    // save refresh token
    await this.authRepo.updateById(user.id, { refreshToken, updatedAt: new Date() });
    return { accessToken, refreshToken };
  }

  /* -------------------------------------------------------
        ENTITY TRANSFORMER
  --------------------------------------------------------*/
  private toEntity(record: any, includeSensitive = false): IAuthUserEntity {
    const { password, refreshToken, ...safe } = record;

    const entity: IAuthUserEntity = {
      ...safe,
      id: record.id.toString(),
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
    };

    if (includeSensitive) {
      entity.password = password;
      entity.refreshToken = refreshToken;
    }

    return entity;
  }
}
