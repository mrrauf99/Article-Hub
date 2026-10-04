import { Router } from "express";

import {
  getProfile,
  getUserSummary,
  getUserStats,
  updateUserProfile,
  changePassword,
  startTwoFactorSetup,
  verifyTwoFactorSetup,
  disableTwoFactor,
} from "../controllers/user.controller.js";
import { uploadImage } from "../middlewares/uploadImage.middleware.js";
import { validateRequest } from "../validations/common.validation.js";
import {
  changePasswordSchema,
  profileSchema,
  twoFactorCodeSchema,
  twoFactorDisableSchema,
  twoFactorSetupSchema,
} from "../validations/user.validation.js";

const userRoutes = Router();

userRoutes.get("/profile", getProfile);

userRoutes.get("/summary", getUserSummary);

userRoutes.get("/stats", getUserStats);

userRoutes.patch(
  "/profile",
  uploadImage.single("avatar"),
  validateRequest(profileSchema, { status: 422, format: "joinedMessage" }),
  updateUserProfile,
);

userRoutes.post("/change-password", validateRequest(changePasswordSchema), changePassword);

userRoutes.post("/2fa/setup", validateRequest(twoFactorSetupSchema), startTwoFactorSetup);
userRoutes.post("/2fa/verify", validateRequest(twoFactorCodeSchema), verifyTwoFactorSetup);
userRoutes.post("/2fa/disable", validateRequest(twoFactorDisableSchema), disableTwoFactor);

export default userRoutes;
