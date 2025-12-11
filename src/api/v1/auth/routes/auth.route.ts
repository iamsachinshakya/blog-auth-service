import { Router } from "express";
import { ControllerProvider } from "../../ControllerProvider";
import { asyncHandler } from "../../common/utils/asyncHandler";
import { validateBody } from "../../common/middlewares/validate.middleware";
import {
  registerUserSchema,
  updatePasswordSchema,
  loginUserSchema,
} from "../validations/auth.validation";
import { authenticateJWT } from "../middlewares/auth.middleware";
// import { requirePermission } from "../middlewares/requirePermission";

export const authRouter = Router();
const authController = ControllerProvider.authController;

/**
 * @route   GET /api/v1/users/current-user
 * @desc    Get details of the logged-in user
 * @access  Private
 */
authRouter.get(
  "/me",
  authenticateJWT,
  asyncHandler(authController.getCurrentUser.bind(authController))
);

/**
 * @route   POST /api/v1/auth/register
 * @desc    Register a new user
 * @access  Public
 */
authRouter.post(
  "/register",
  validateBody(registerUserSchema),
  asyncHandler(authController.register.bind(authController))
);

/**
 * @route   POST /api/v1/auth/login
 * @desc    Login and get access + refresh tokens
 * @access  Public
 */
authRouter.post(
  "/login",
  validateBody(loginUserSchema),
  asyncHandler(authController.login.bind(authController))
);

/**
 * @route   POST /api/v1/auth/refresh-token
 * @desc    Refresh access token using a valid refresh token
 * @access  Public
 */
authRouter.post(
  "/refresh-token",
  asyncHandler(authController.refreshAccessToken.bind(authController))
);

/**
 * @route   POST /api/v1/auth/logout
 * @desc    Logout the current user and invalidate tokens
 * @access  Private (Requires user update permission)
 */
authRouter.post(
  "/logout",
  authenticateJWT,
  asyncHandler(authController.logout.bind(authController))
);

/**
 * @route   POST /api/v1/auth/change-password
 * @desc    Change password for the logged-in user
 * @access  Private (Requires user update permission)
 */
authRouter.post(
  "/:userId/change-password",
  authenticateJWT,
  validateBody(updatePasswordSchema),
  asyncHandler(authController.changePassword.bind(authController))
);

export default authRouter;
