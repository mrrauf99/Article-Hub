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
import { authenticate } from "../middlewares/authenticate.middleware.js";
import { COOKIE_NAMES } from "../constants/cookieNames.js";
import { requireRole } from "../middlewares/requireRole.middleware.js";
import { requireArticleOwner } from "../middlewares/requireArticleOwner.middleware.js";

const articleRoutes = Router();

articleRoutes.get("/", getApprovedArticles);

articleRoutes.get("/me", authenticate(COOKIE_NAMES.ACCESS), getMyArticles);

// For guest
articleRoutes.get("/:articleId", getArticleById);

// For user (approved , rejected, pending article)
articleRoutes.get("/me/:articleId", authenticate(COOKIE_NAMES.ACCESS), getArticleById);

// Increment views
articleRoutes.post("/:articleId/view", incrementArticleViews);

articleRoutes.post(
  "/",
  authenticate(COOKIE_NAMES.ACCESS),
  uploadImage.single("image"),
  createArticle,
);

articleRoutes.patch(
  "/:articleId",
  authenticate(COOKIE_NAMES.ACCESS),
  requireRole("user"),
  requireArticleOwner,
  uploadImage.single("image"),
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
