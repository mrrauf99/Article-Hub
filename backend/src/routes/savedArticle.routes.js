import { Router } from "express";
import {
  getSavedArticles,
  saveArticle,
  unsaveArticle,
} from "../controllers/savedArticle.controller.js";
import { validateArticleIdParam } from "../middlewares/validateArticleIdParam.middleware.js";
import { validateRequest, paginationQuerySchema } from "../validations/common.validation.js";

const savedArticleRoutes = Router();

savedArticleRoutes.param("articleId", validateArticleIdParam);

function requireAjaxRequest(req, res, next) {
  if (req.get("X-Requested-With") !== "XMLHttpRequest") {
    return res.status(403).json({
      success: false,
      message: "Invalid request.",
    });
  }
  next();
}

// GET returns { articles, pagination }; mutations return { article_id, is_saved }.
// Saving is idempotent (201 new, 200 existing); deletion is always idempotent.
savedArticleRoutes.get(
  "/",
  validateRequest(paginationQuerySchema, { source: "query" }),
  getSavedArticles,
);
savedArticleRoutes.post("/:articleId", requireAjaxRequest, saveArticle);
savedArticleRoutes.delete("/:articleId", requireAjaxRequest, unsaveArticle);

export default savedArticleRoutes;
