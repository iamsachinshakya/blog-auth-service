import { AuthService } from "./auth/services/auth.service";
import { IAuthService } from "./auth/services/auth.service.interface";

export class ServiceProvider {
    private static _authServiceInstance: AuthService;

    static get authService(): IAuthService {
        if (!this._authServiceInstance)
            this._authServiceInstance = new AuthService();
        return this._authServiceInstance;
    }
}
