export enum UserRole {
    USER = "user",
    EDITOR = "editor",
    AUTHOR = "author",
    ADMIN = "admin",
}

export enum UserStatus {
    ACTIVE = "active",
    INACTIVE = "inactive",
    PENDING = "pending",       // user registered but not verified
    SUSPENDED = "suspended",   // temporarily blocked
    DELETED = "deleted",       // account deleted
    BANNED = "banned"          // permanently banned
}


/**
 * Pure domain model — DB agnostic
 */
export interface IAuthUserEntity {
    id: string;
    username: string;
    email: string;
    password: string;
    role: UserRole;
    status: UserStatus;
    refreshToken: string | null;
    createdAt: Date;
    updatedAt: Date;
    lastLogin: Date | null;
}
