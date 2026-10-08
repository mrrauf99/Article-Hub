import { Router } from "express";
import {
  getDashboardStats,
  getDashboardSummary,
  getArticles,
  getArticleDetails,
  getPendingArticles,
  approveArticle,
  rejectArticle,
  deleteArticle,
  getUsers,
  getUserDetails,
  deleteUser,
} from "../controllers/admin.controller.js";
import {
  validateArticleIdParam,
  validateUserIdParam,
} from "../middlewares/validateArticleIdParam.middleware.js";
import { validateRequest } from "../validations/common.validation.js";
import {
  adminArticlesQuerySchema,
  adminUsersQuerySchema,
  deletionReasonSchema,
  reasonSchema,
} from "../validations/article.validation.js";

const adminRoutes = Router();

adminRoutes.param("articleId", validateArticleIdParam);
adminRoutes.param("userId", validateUserIdParam);

adminRoutes.get("/dashboard/stats", getDashboardStats);
adminRoutes.get("/dashboard/summary", getDashboardSummary);

adminRoutes.get(
  "/articles",
  validateRequest(adminArticlesQuerySchema, { source: "query" }),
  getArticles,
);
adminRoutes.get("/articles/pending", getPendingArticles);
adminRoutes.get("/articles/:articleId", getArticleDetails);
adminRoutes.patch("/articles/:articleId/approve", approveArticle);
adminRoutes.patch(
  "/articles/:articleId/reject",
  validateRequest(reasonSchema),
  rejectArticle,
);
adminRoutes.delete(
  "/articles/:articleId",
  validateRequest(deletionReasonSchema),
  deleteArticle,
);

adminRoutes.get(
  "/users",
  validateRequest(adminUsersQuerySchema, { source: "query" }),
  getUsers,
);
adminRoutes.get("/users/:userId", getUserDetails);
adminRoutes.delete("/users/:userId", deleteUser);

export default adminRoutes;
