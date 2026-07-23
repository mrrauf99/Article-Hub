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
import { authenticate } from "../middlewares/authenticate.middleware.js";
import { COOKIE_NAMES } from "../constants/cookieNames.js";

const articleRoutes = Router();

articleRoutes.get("/", getApprovedArticles);

articleRoutes.get("/me", authenticate(COOKIE_NAMES.ACCESS), getMyArticles);

articleRoutes.get("/:id", getArticleById);

// Increment views - no auth required (guest can view), but admin views don't count
articleRoutes.post("/:id/view", incrementArticleViews);

articleRoutes.post(
  "/",
  authenticate(COOKIE_NAMES.ACCESS),
  uploadImage.single("image"),
  createArticle,
);

articleRoutes.patch(
  "/:articleId",
  authenticate(COOKIE_NAMES.ACCESS),
  uploadImage.single("image"),
  updateArticle,
);

articleRoutes.delete(
  "/:articleId",
  authenticate(COOKIE_NAMES.ACCESS),
  deleteArticle,
);

articleRoutes.post(
  "/upload-image",
  uploadImage.single("image"),
  uploadImageToCloudinary,
);

export default articleRoutes;
