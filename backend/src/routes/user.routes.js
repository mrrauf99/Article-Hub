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
import { uploadImage } from "../middlewares/uploadImage.middleware.js";

const userRoutes = Router();

userRoutes.get("/profile", getProfile);

userRoutes.get("/stats", getUserStats);

userRoutes.patch("/profile", uploadImage.single("avatar"), updateUserProfile);

userRoutes.post("/change-password", changePassword);

userRoutes.post("/2fa/setup", startTwoFactorSetup);
userRoutes.post("/2fa/verify", verifyTwoFactorSetup);
userRoutes.post("/2fa/disable", disableTwoFactor);

export default userRoutes;
