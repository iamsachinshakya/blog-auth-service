export enum UserRole {
    USER = "user",
    EDITOR = "editor",
    AUTHOR = "author",
    ADMIN = "admin",
}

export enum AuthStatus {
    ACTIVE = "active",
    INACTIVE = "inactive",
    PENDING = "pending",       // user registered but not verified
    SUSPENDED = "suspended",   // temporarily blocked
    DELETED = "deleted",       // account deleted
    BANNED = "banned"          // permanently banned
}

export interface ICreateDto {
    createdAt: Date;
    updatedAt: Date;
}

export interface IAuthUser {
    id: string;
    username: string;
    email: string;
    role: UserRole;
    status: AuthStatus;
    isVerified: boolean;
}