import { articleIdSchema, userIdSchema } from "../validations/common.validation.js";

export function validateArticleIdParam(req, res, next, articleId) {
  const id = articleId ?? req.params?.articleId;

  if (!articleIdSchema.safeParse(id).success) {
    return res.status(400).json({
      success: false,
      message: "Invalid article ID.",
    });
  }

  next();
}

export function validateUserIdParam(req, res, next, userId) {
  const id = userId ?? req.params?.userId;

  if (!userIdSchema.safeParse(id).success) {
    return res.status(400).json({
      success: false,
      message: "Invalid user ID.",
    });
  }

  next();
}
