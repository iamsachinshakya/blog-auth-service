import { AuthController } from "./auth/controllers/auth.controller";
import { IAuthController } from "./auth/controllers/auth.controller.interface";
export class ControllerProvider {
    private static _authControllerInstance: AuthController;

    static get authController(): IAuthController {
        if (!this._authControllerInstance)
            this._authControllerInstance = new AuthController();
        return this._authControllerInstance;
    }

}
