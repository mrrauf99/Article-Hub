import express from "express";
import {
  getPendingArticles,
  approveArticle,
  rejectArticle,
} from "../controllers/admin.controller.js";

import { requireAuth } from "../middlewares/auth.middleware.js";
import { requireAdmin } from "../middlewares/admin.middleware.js";

const adminRoutes = express.Router();

adminRoutes.get(
  "/articles/pending",
  requireAuth,
  requireAdmin,
  getPendingArticles
);

adminRoutes.patch(
  "/articles/:articleId/approve",
  requireAuth,
  requireAdmin,
  approveArticle
);

adminRoutes.patch(
  "/articles/:articleId/reject",
  requireAuth,
  requireAdmin,
  rejectArticle
);

export default adminRoutes;
