import { Router } from "express";
import {
  getApprovedArticles,
  createArticle,
  updateArticle,
  deleteArticle,
  getMyArticles,
  getArticleById,
  uploadImageToCloudinary,
} from "../controllers/article.controller.js";

import { uploadImage } from "../middlewares/uploadImage.middleware.js";
import { requireAuth } from "../middlewares/auth.middleware.js";

const articleRoutes = Router();

articleRoutes.get("/", getApprovedArticles);

articleRoutes.get("/me", requireAuth, getMyArticles);

articleRoutes.get("/:id", getArticleById);

articleRoutes.post("/", requireAuth, createArticle);

articleRoutes.patch("/:id", requireAuth, updateArticle);

articleRoutes.delete("/:id", requireAuth, deleteArticle);

articleRoutes.post(
  "/upload-image",
  uploadImage.single("image"),
  uploadImageToCloudinary
);

export default articleRoutes;
