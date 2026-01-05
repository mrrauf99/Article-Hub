import { Router } from "express";
import {
  getApprovedArticles,
  createArticle,
  updateArticle,
  deleteArticle,
  getMyArticles,
  getArticleById,
  uploadImageToCloudinary,
  incrementArticleViews,
} from "../controllers/article.controller.js";

import { uploadImage } from "../middlewares/uploadImage.middleware.js";
import { requireAuth } from "../middlewares/auth.middleware.js";

const articleRoutes = Router();

articleRoutes.get("/", getApprovedArticles);

articleRoutes.get("/me", requireAuth, getMyArticles);

articleRoutes.get("/:id", getArticleById);

// Increment views - no auth required (guest can view), but admin views don't count
articleRoutes.post("/:id/view", incrementArticleViews);

articleRoutes.post(
  "/",
  requireAuth,
  uploadImage.single("image"),
  createArticle
);

articleRoutes.patch(
  "/:articleId",
  requireAuth,
  uploadImage.single("image"),
  updateArticle
);

articleRoutes.delete("/:articleId", requireAuth, deleteArticle);

articleRoutes.post(
  "/upload-image",
  uploadImage.single("image"),
  uploadImageToCloudinary
);

export default articleRoutes;
