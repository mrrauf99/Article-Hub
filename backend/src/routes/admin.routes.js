import { Router } from "express";
import {
  getDashboardStats,
  getDashboardSummary,
  getDashboardRecentActivity,
  getArticles,
  getArticleDetails,
  getPendingArticles,
  approveArticle,
  rejectArticle,
  deleteArticle,
  getUsers,
  getUserDetails,
  updateUserRole,
  deleteUser,
} from "../controllers/admin.controller.js";

const adminRoutes = Router();

// Dashboard
adminRoutes.get("/dashboard/stats", getDashboardStats);
adminRoutes.get("/dashboard/summary", getDashboardSummary);
adminRoutes.get("/dashboard/recent", getDashboardRecentActivity);

// Articles
adminRoutes.get("/articles", getArticles);
adminRoutes.get("/articles/pending", getPendingArticles);
adminRoutes.get("/articles/:articleId", getArticleDetails);
adminRoutes.patch("/articles/:articleId/approve", approveArticle);
adminRoutes.patch("/articles/:articleId/reject", rejectArticle);
adminRoutes.delete("/articles/:articleId", deleteArticle);

// Users
adminRoutes.get("/users", getUsers);
adminRoutes.get("/users/:userId", getUserDetails);
adminRoutes.patch("/users/:userId/role", updateUserRole);
adminRoutes.delete("/users/:userId", deleteUser);

export default adminRoutes;
