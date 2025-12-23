import db from "../config/db.config.js";

// GET all pending articles

export const getPendingArticles = async (req, res) => {
  try {
    const { rows } = await db.query(
      `SELECT
        a.article_id,
        a.title,
        a.created_at,
        u.name AS author_name
       FROM articles a
       JOIN users u ON u.id = a.author_id
       WHERE a.status = 'pending'
       ORDER BY a.created_at ASC`
    );

    res.json({ success: true, data: rows });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch pending articles" });
  }
};

// APPROVE article

export const approveArticle = async (req, res) => {
  const { articleId } = req.params;

  try {
    const { rowCount } = await db.query(
      `UPDATE articles
       SET status = 'approved',
           published_at = NOW()
       WHERE article_id = $1`,
      [articleId]
    );

    if (!rowCount) {
      return res.status(404).json({
        success: false,
        message: "Article not found",
      });
    }

    res.json({ success: true, message: "Article approved" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Approval failed" });
  }
};

// REJECT article

export const rejectArticle = async (req, res) => {
  const { articleId } = req.params;

  try {
    const { rowCount } = await db.query(
      `UPDATE articles
       SET status = 'rejected',
           published_at = NULL
       WHERE article_id = $1`,
      [articleId]
    );

    if (!rowCount) {
      return res.status(404).json({
        success: false,
        message: "Article not found",
      });
    }

    res.json({ success: true, message: "Article rejected" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Rejection failed" });
  }
};
