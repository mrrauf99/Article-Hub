import { Router } from "express";

import {
  getProfile,
  getUserStats,
  updateUserProfile,
  changePassword,
  startTwoFactorSetup,
  verifyTwoFactorSetup,
  disableTwoFactor,
} from "../controllers/user.controller.js";
import { requireAuth } from "../middlewares/auth.middleware.js";
import { uploadImage } from "../middlewares/uploadImage.middleware.js";

const userRoutes = Router();

userRoutes.get("/profile", requireAuth, getProfile);

userRoutes.get("/stats", requireAuth, getUserStats);

userRoutes.patch(
  "/profile",
  requireAuth,
  uploadImage.single("avatar"),
  updateUserProfile
);

userRoutes.post("/change-password", requireAuth, changePassword);

userRoutes.post("/2fa/setup", requireAuth, startTwoFactorSetup);
userRoutes.post("/2fa/verify", requireAuth, verifyTwoFactorSetup);
userRoutes.post("/2fa/disable", requireAuth, disableTwoFactor);

export default userRoutes;
