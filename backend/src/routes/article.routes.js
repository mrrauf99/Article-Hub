import { Router } from "express";
import {
  getApprovedArticles,
  createArticle,
  updateArticle,
  deleteArticle,
  getMyArticles,
  getArticleById,
  incrementArticleViews,
} from "../controllers/article.controller.js";

import { uploadImage } from "../middlewares/uploadImage.middleware.js";
import { authenticate, optionalAuthenticate } from "../middlewares/authenticate.middleware.js";
import { COOKIE_NAMES } from "../constants/cookieNames.js";
import { requireRole } from "../middlewares/requireRole.middleware.js";
import { requireArticleOwner } from "../middlewares/requireArticleOwner.middleware.js";
import { validateArticleIdParam } from "../middlewares/validateArticleIdParam.middleware.js";
import { validateRequest } from "../validations/common.validation.js";
import {
  approvedArticlesQuerySchema,
  articleWriteSchema,
} from "../validations/article.validation.js";

const articleRoutes = Router();

articleRoutes.param("articleId", validateArticleIdParam);

articleRoutes.get(
  "/",
  optionalAuthenticate(COOKIE_NAMES.ACCESS),
  validateRequest(approvedArticlesQuerySchema, { source: "query" }),
  getApprovedArticles,
);

articleRoutes.get("/me", authenticate(COOKIE_NAMES.ACCESS), getMyArticles);

articleRoutes.get("/:articleId", optionalAuthenticate(COOKIE_NAMES.ACCESS), getArticleById);

// Owners may read their articles at any moderation status.
articleRoutes.get("/me/:articleId", authenticate(COOKIE_NAMES.ACCESS), requireArticleOwner, getArticleById);

articleRoutes.post("/:articleId/view", optionalAuthenticate(COOKIE_NAMES.ACCESS), incrementArticleViews);

articleRoutes.post(
  "/",
  authenticate(COOKIE_NAMES.ACCESS),
  uploadImage.single("image"),
  validateRequest(articleWriteSchema, { status: 422, format: "errors" }),
  createArticle,
);

articleRoutes.patch(
  "/:articleId",
  authenticate(COOKIE_NAMES.ACCESS),
  requireRole("user"),
  requireArticleOwner,
  uploadImage.single("image"),
  validateRequest(articleWriteSchema, { status: 422, format: "errors" }),
  updateArticle,
);

articleRoutes.delete(
  "/:articleId",
  authenticate(COOKIE_NAMES.ACCESS),
  requireRole("user"),
  requireArticleOwner,
  deleteArticle,
);

export default articleRoutes;
