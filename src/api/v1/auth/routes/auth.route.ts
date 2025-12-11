import { Router } from "express";
import { validateBody } from "../../common/middlewares/validate.middleware";
import {
  registerUserSchema,
  updatePasswordSchema,
  loginUserSchema,
} from "../validations/auth.validation";
import { authenticateJWT } from "../../common/middlewares/auth.middleware";
import { asyncHandler } from "../../common/utils/asyncHandler";
import { AuthController } from "../controllers/auth.controller";
import { AuthService } from "../services/auth.service";
import { AuthRepository } from "../repositories/auth.repository";

export const authRouter = Router();

// Proper DI chain
const authRepo = new AuthRepository();
const authService = new AuthService(authRepo);
const authController = new AuthController(authService);

/**
 * @route POST /api/v1/auth/register
 */
authRouter.post(
  "/register",
  validateBody(registerUserSchema),
  asyncHandler(authController.register.bind(authController))
);

/**
 * @route POST /api/v1/auth/login
 */
authRouter.post(
  "/login",
  validateBody(loginUserSchema),
  asyncHandler(authController.login.bind(authController))
);

/**
 * @route POST /api/v1/auth/refresh-token
 */
authRouter.post(
  "/refresh-token",
  asyncHandler(authController.refreshAccessToken.bind(authController))
);

/**
 * @route POST /api/v1/auth/logout
 */
authRouter.post(
  "/logout",
  authenticateJWT,
  asyncHandler(authController.logout.bind(authController))
);

/**
 * @route POST /api/v1/auth/:id/change-password
 */
authRouter.post(
  "/:id/change-password",
  authenticateJWT,
  validateBody(updatePasswordSchema),
  asyncHandler(authController.changePassword.bind(authController))
);

export default authRouter;
