import express from "express";
import {
  getApprovedArticles,
  createArticle,
  updateArticle,
  deleteArticle,
  getMyArticles,
  getArticleById,
} from "../controllers/article.controller.js";

import { requireAuth } from "../middlewares/auth.middleware.js";

const articleRoutes = express.Router();

articleRoutes.get("/", getApprovedArticles);

articleRoutes.get("/me", requireAuth, getMyArticles);

articleRoutes.get("/:id", getArticleById);

articleRoutes.post("/new-article", requireAuth, createArticle);

articleRoutes.patch("/:id", requireAuth, updateArticle);

articleRoutes.delete("/:id", requireAuth, deleteArticle);

export default articleRoutes;
