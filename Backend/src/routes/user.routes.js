import { Router } from "express";

import {
  getProfile,
  getUserStats,
  updateUserProfile,
} from "../controllers/user.controller.js";
import { requireAuth } from "../middlewares/auth.middleware.js";

const userRoutes = Router();

userRoutes.get("/profile", requireAuth, getProfile);

userRoutes.get("/stats", requireAuth, getUserStats);

userRoutes.patch("/profile", requireAuth, updateUserProfile);

export default userRoutes;
