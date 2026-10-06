import {
  getSavedArticles as findSavedArticles,
  saveArticle as createSavedArticle,
  unsaveArticle as deleteSavedArticle,
} from "../services/savedArticle.service.js";

export async function saveArticle(req, res) {
  const { articleId } = req.params;
  const result = await createSavedArticle(req.user.userId, articleId);
  if (!result.available) {
    return res.status(404).json({
      success: false,
      message: "Article not found or unavailable.",
    });
  }

  return res.status(result.created ? 201 : 200).json({
    success: true,
    message: result.created ? "Article saved." : "Article already saved.",
    data: {
      article_id: articleId,
      is_saved: true,
    },
  });
}

export async function unsaveArticle(req, res) {
  const { articleId } = req.params;
  await deleteSavedArticle(req.user.userId, articleId);

  return res.status(200).json({
    success: true,
    message: "Article removed from saved articles.",
    data: {
      article_id: articleId,
      is_saved: false,
    },
  });
}

export async function getSavedArticles(req, res) {
  const { page, limit } = req.validated.query;
  const data = await findSavedArticles(req.user.userId, page, limit);

  return res.status(200).json({ success: true, data });
}
