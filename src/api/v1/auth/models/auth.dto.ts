import { UserRole, UserStatus } from "./auth.entity";

export interface IRegisterData {
    username: string;
    email: string;
    password: string;
    role?: UserRole;
}

export interface ILoginCredentials {
    email: string;
    password: string;
}

export interface IChangePassword {
    oldPassword: string;
    newPassword: string;
}

export interface IAuthUser {
    id: string;
    email: string;
    role: UserRole;
    status: UserStatus;
}
