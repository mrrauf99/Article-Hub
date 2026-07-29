import db from "../config/db.config.js";

// Check article exists and user owns the article

export async function requireArticleOwner(req, res, next) {
  const { articleId } = req.params;
  const { userId } = req.user;

  const { rows, rowCount } = await db.query(
    `
      SELECT author_id, image_url, image_public_id
      FROM articles
      WHERE id = $1
    `,
    [articleId],
  );

  if (rowCount === 0) {
    return res.status(404).json({
      success: false,
      message: "Article not found.",
    });
  }

  if (rows[0].author_id !== userId) {
    return res.status(403).json({
      success: false,
      message: "Not authorized to modify this article.",
    });
  }

  req.article = rows[0];

  next();
}
