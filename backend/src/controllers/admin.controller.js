import db from "../config/db.config.js";
import { deleteImageFromCloudinary } from "../services/cloudinary.service.js";
import { sendArticleStatusEmail } from "../services/email.service.js";

async function fetchArticleAuthorDetails(articleId) {
  const { rows } = await db.query(
    `SELECT
      a.article_id,
      a.title,
      u.name AS author_name,
      u.email AS author_email
     FROM articles a
     JOIN users u ON u.id = a.author_id
     WHERE a.article_id = $1`,
    [articleId],
  );

  return rows[0] || null;
}

async function fetchDashboardStats() {
  const statsQuery = await db.query(`
    SELECT
      (SELECT COUNT(*) FROM users WHERE role = 'user') AS total_users,
      (SELECT COUNT(*) FROM users WHERE role = 'admin') AS total_admins,
      (SELECT COUNT(*) FROM articles) AS total_articles,
      (SELECT COUNT(*) FROM articles WHERE status = 'approved') AS approved_articles,
      (SELECT COUNT(*) FROM articles WHERE status = 'pending') AS pending_articles,
      (SELECT COUNT(*) FROM articles WHERE status = 'rejected') AS rejected_articles,
      (SELECT COALESCE(SUM(views), 0) FROM articles) AS total_views
  `);

  return statsQuery.rows[0];
}

async function fetchRecentActivity() {
  const recentArticles = await db.query(`
    SELECT
      a.article_id,
      a.title,
      a.status,
      a.created_at,
      u.name AS author_name,
      u.avatar_url AS author_avatar
    FROM articles a
    JOIN users u ON u.id = a.author_id
    ORDER BY a.created_at DESC
    LIMIT 5
  `);

  const recentUsers = await db.query(`
    SELECT id, username, name, email, avatar_url, role, joined_at
    FROM users
    ORDER BY joined_at DESC
    LIMIT 5
  `);

  return {
    recentArticles: recentArticles.rows,
    recentUsers: recentUsers.rows,
  };
}

export const getDashboardStats = async (req, res) => {
  const [stats, recent] = await Promise.all([
    fetchDashboardStats(),
    fetchRecentActivity(),
  ]);

  res.json({
    success: true,
    data: {
      stats,
      recentArticles: recent.recentArticles,
      recentUsers: recent.recentUsers,
    },
  });
};

export const getDashboardSummary = async (req, res) => {
  const stats = await fetchDashboardStats();
  res.json({
    success: true,
    data: { stats },
  });
};

export const getDashboardRecentActivity = async (req, res) => {
  const recent = await fetchRecentActivity();
  res.json({
    success: true,
    data: recent,
  });
};

export const getArticles = async (req, res) => {
  const { status = "all", search = "", page = 1, limit = 10 } = req.query;
  const offset = (page - 1) * limit;

  let whereClause = "WHERE 1=1";
  const params = [];
  let paramIndex = 1;

  if (status && status !== "all") {
    whereClause += ` AND a.status = $${paramIndex}`;
    params.push(status);
    paramIndex++;
  }

  if (search) {
    whereClause += ` AND (a.title ILIKE $${paramIndex} OR u.name ILIKE $${paramIndex})`;
    params.push(`%${search}%`);
    paramIndex++;
  }

  const countQuery = await db.query(
    `SELECT COUNT(*) FROM articles a JOIN users u ON u.id = a.author_id ${whereClause}`,
    params,
  );
  const totalCount = parseInt(countQuery.rows[0].count);

  const articlesQuery = await db.query(
    `SELECT
        a.article_id,
        a.title,
        a.summary,
        a.category,
        a.status,
        a.views,
        a.image_url,
        a.created_at,
        a.published_at,
        u.id AS author_id,
        u.name AS author_name,
        u.avatar_url AS author_avatar
       FROM articles a
       JOIN users u ON u.id = a.author_id
       ${whereClause}
       ORDER BY a.created_at DESC
       LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`,
    [...params, limit, offset],
  );

  res.json({
    success: true,
    data: {
      articles: articlesQuery.rows,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        totalCount,
        totalPages: Math.ceil(totalCount / limit),
      },
    },
  });
};

export const getArticleDetails = async (req, res) => {
  const { articleId } = req.params;
  const { rows } = await db.query(
    `SELECT
        a.*,
        u.id AS author_id,
        u.name AS author_name,
        u.email AS author_email,
        u.avatar_url AS author_avatar
       FROM articles a
       JOIN users u ON u.id = a.author_id
       WHERE a.article_id = $1`,
    [articleId],
  );

  if (!rows.length) {
    return res
      .status(404)
      .json({ success: false, message: "Article not found" });
  }

  res.json({ success: true, data: rows[0] });
};

export const getPendingArticles = async (req, res) => {
  const { rows } = await db.query(
    `SELECT
        a.article_id,
        a.title,
        a.created_at,
        u.name AS author_name
       FROM articles a
       JOIN users u ON u.id = a.author_id
       WHERE a.status = 'pending'
       ORDER BY a.created_at ASC`,
  );

  res.json({ success: true, data: rows });
};

export const approveArticle = async (req, res) => {
  const { articleId } = req.params;

  const { rowCount } = await db.query(
    `UPDATE articles
       SET status = 'approved',
           published_at = NOW()
       WHERE article_id = $1`,
    [articleId],
  );

  if (!rowCount) {
    return res.status(404).json({
      success: false,
      message: "Article not found",
    });
  }

  const authorDetails = await fetchArticleAuthorDetails(articleId);

  if (!authorDetails) {
    return res.status(404).json({
      success: false,
      message: "Article not found",
    });
  }

  await sendArticleStatusEmail({
    to: authorDetails.author_email,
    name: authorDetails.author_name,
    articleTitle: authorDetails.title,
    status: "approved",
  });

  res.json({ success: true, message: "Article approved" });
};

export const rejectArticle = async (req, res) => {
  const { articleId } = req.params;
  const reason = req.body.reason?.trim();

  if (!reason) {
    return res.status(400).json({
      success: false,
      message: "Rejection reason is required",
    });
  }

  const { rowCount } = await db.query(
    `UPDATE articles
       SET status = 'rejected',
           published_at = NULL
       WHERE article_id = $1`,
    [articleId],
  );

  if (!rowCount) {
    return res.status(404).json({
      success: false,
      message: "Article not found",
    });
  }

  const authorDetails = await fetchArticleAuthorDetails(articleId);

  if (!authorDetails) {
    return res.status(404).json({
      success: false,
      message: "Article not found",
    });
  }

  await sendArticleStatusEmail({
    to: authorDetails.author_email,
    name: authorDetails.author_name,
    articleTitle: authorDetails.title,
    status: "rejected",
    reason,
  });

  res.json({ success: true, message: "Article rejected" });
};

export const deleteArticle = async (req, res) => {
  const { articleId } = req.params;
  const reason = req.body.reason?.trim();

  if (!reason) {
    return res.status(400).json({
      success: false,
      message: "Deletion reason is required",
    });
  }

  // First, get the article to fetch image URL before deletion
  const articleQuery = await db.query(
    `SELECT
        a.image_public_id,
        a.title,
        u.name AS author_name,
        u.email AS author_email
       FROM articles a
       JOIN users u ON u.id = a.author_id
       WHERE a.article_id = $1`,
    [articleId],
  );

  if (articleQuery.rows.length === 0) {
    return res.status(404).json({
      success: false,
      message: "Article not found",
    });
  }

  const article = articleQuery.rows[0];
  const imagePublicId = article.image_public_id;

  // Delete image from Cloudinary if it exists (before database deletion)
  if (imagePublicId) {
    try {
      await deleteImageFromCloudinary(imagePublicId);
    } catch (deleteErr) {
      // Log error but don't fail the request if deletion fails
      console.error("Failed to delete image from Cloudinary:", deleteErr);
    }
  }

  // Delete the article from database
  await db.query(`DELETE FROM articles WHERE article_id = $1`, [articleId]);

  await sendArticleStatusEmail({
    to: article.author_email,
    name: article.author_name,
    articleTitle: article.title,
    status: "deleted",
    reason,
  });

  res.json({ success: true, message: "Article deleted successfully" });
};

export const getUsers = async (req, res) => {
  const { role = "all", search = "", page = 1, limit = 10 } = req.query;
  const offset = (page - 1) * limit; // skip rows

  let whereClause = "WHERE 1=1";
  const params = [];
  let paramIndex = 1;

  if (role !== "all") {
    whereClause += ` AND role = $${paramIndex}`;
    params.push(role);
    paramIndex++;
  }

  if (search) {
    whereClause += ` AND (name ILIKE $${paramIndex} OR email ILIKE $${paramIndex} OR username ILIKE $${paramIndex})`;
    params.push(`%${search}%`);
    paramIndex++;
  }

  const countQuery = await db.query(
    `SELECT COUNT(*) FROM users ${whereClause}`,
    params,
  );
  const totalCount = parseInt(countQuery.rows[0].count);

  const usersQuery = await db.query(
    `SELECT
        id,
        username,
        name,
        email,
        avatar_url,
        role,
        bio,
        joined_at,
        (SELECT COUNT(*) FROM articles WHERE author_id = users.id) AS article_count
       FROM users
       ${whereClause}
       ORDER BY joined_at DESC
       LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`,
    [...params, limit, offset],
  );

  res.json({
    success: true,
    data: {
      users: usersQuery.rows,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        totalCount,
        totalPages: Math.ceil(totalCount / limit),
      },
    },
  });
};

export const getUserDetails = async (req, res) => {
  const { userId } = req.params;
  const userQuery = await db.query(
    `SELECT id, username, name, email, avatar_url, role, bio, expertise, gender, country, portfolio_url, x_url, linkedin_url, facebook_url, instagram_url, joined_at
       FROM users WHERE id = $1`,
    [userId],
  );

  if (!userQuery.rows.length) {
    return res.status(404).json({ success: false, message: "User not found" });
  }

  const articlesQuery = await db.query(
    `SELECT article_id, title, status, created_at, views
       FROM articles WHERE author_id = $1
       ORDER BY created_at DESC`,
    [userId],
  );

  res.json({
    success: true,
    data: {
      user: userQuery.rows[0],
      articles: articlesQuery.rows,
    },
  });
};

export const updateUserRole = async (req, res) => {
  const { userId } = req.params;
  const { role } = req.body;
  const adminId = req.user.userId;

  if (!["user", "admin"].includes(role)) {
    return res.status(400).json({ success: false, message: "Invalid role." });
  }

  // Prevent admin from changing their own role
  if (String(userId) === String(adminId)) {
    return res.status(400).json({
      success: false,
      message: "Cannot change your own role.",
    });
  }

  // Update user role in database
  const { rowCount } = await db.query(
    `UPDATE users SET role = $1 WHERE id = $2`,
    [role, userId],
  );

  if (!rowCount) {
    return res.status(404).json({ success: false, message: "User not found." });
  }

  res.json({ success: true, message: `User role updated to ${role}` });
};

export const deleteUser = async (req, res) => {
  const { userId } = req.params;
  const adminId = req.user.userId;

  // Prevent admin from deleting themselves
  if (String(userId) === String(adminId)) {
    return res.status(400).json({
      success: false,
      message: "Cannot delete your own account.",
    });
  }

  // Check user exists
  const userQuery = await db.query(
    `SELECT avatar_public_id FROM users WHERE id = $1`,
    [userId],
  );

  if (userQuery.rows.length === 0) {
    return res.status(404).json({ success: false, message: "User not found." });
  }

  const { rows: articles } = await db.query(
    `
    DELETE FROM articles
    WHERE author_id = $1
    RETURNING image_public_id
    `,
    [userId],
  );

  // Delete article images from Cloudinary
  for (const article of articles) {
    if (article.image_public_id) {
      try {
        await deleteImageFromCloudinary(article.image_public_id);
      } catch (deleteErr) {
        console.error(
          "Failed to delete article image from Cloudinary:",
          deleteErr,
        );
      }
    }
  }

  // delete the user
  await db.query(`DELETE FROM users WHERE id = $1`, [userId]);

  // Delete user avatar from Cloudinary if it exists
  const { avatar_public_id } = userQuery.rows[0];

  if (avatar_public_id) {
    try {
      await deleteImageFromCloudinary(avatar_public_id);
    } catch (deleteErr) {
      console.error("Failed to delete avatar from Cloudinary:", deleteErr);
    }
  }

  res.json({ success: true, message: "User deleted successfully" });
};
