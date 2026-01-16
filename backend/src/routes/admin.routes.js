import { Router } from "express";
import {
  getDashboardStats,
  getDashboardSummary,
  getDashboardRecent,
  getAllArticles,
  getArticleDetails,
  getPendingArticles,
  approveArticle,
  rejectArticle,
  deleteArticle,
  getAllUsers,
  getUserDetails,
  updateUserRole,
  deleteUser,
} from "../controllers/admin.controller.js";

import { requireAuth } from "../middlewares/auth.middleware.js";
import { requireAdmin } from "../middlewares/admin.middleware.js";

const adminRoutes = Router();

// All admin routes require authentication and admin role
adminRoutes.use(requireAuth, requireAdmin);

// Dashboard
adminRoutes.get("/dashboard/stats", getDashboardStats);
adminRoutes.get("/dashboard/summary", getDashboardSummary);
adminRoutes.get("/dashboard/recent", getDashboardRecent);

// Articles
adminRoutes.get("/articles", getAllArticles);
adminRoutes.get("/articles/pending", getPendingArticles);
adminRoutes.get("/articles/:articleId", getArticleDetails);
adminRoutes.patch("/articles/:articleId/approve", approveArticle);
adminRoutes.patch("/articles/:articleId/reject", rejectArticle);
adminRoutes.delete("/articles/:articleId", deleteArticle);

// Users
adminRoutes.get("/users", getAllUsers);
adminRoutes.get("/users/:userId", getUserDetails);
adminRoutes.patch("/users/:userId/role", updateUserRole);
adminRoutes.delete("/users/:userId", deleteUser);

export default adminRoutes;
