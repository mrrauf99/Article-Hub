import { getArticleOwnership } from "../services/article.service.js";

export async function requireArticleOwner(req, res, next) {
  const { articleId } = req.params;
  const article = await getArticleOwnership(articleId);

  if (!article) {
    return res.status(404).json({
      success: false,
      message: "Article not found.",
    });
  }

  if (article.author_id !== req.user.userId) {
    return res.status(403).json({
      success: false,
      message: "You can only edit or delete articles you wrote.",
    });
  }

  req.article = article;

  next();
}
