import db from "../config/db.config.js";
import { deleteImageByUrl } from "../utils/cloudinary.utils.js";

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
    SELECT id, username, name, email, avatar_url AS avatar, role, joined_at
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
  try {
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
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch dashboard stats" });
  }
};

export const getDashboardSummary = async (req, res) => {
  try {
    const stats = await fetchDashboardStats();
    res.json({
      success: true,
      data: { stats },
    });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch dashboard stats" });
  }
};

export const getDashboardRecent = async (req, res) => {
  try {
    const recent = await fetchRecentActivity();
    res.json({
      success: true,
      data: recent,
    });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch recent activity" });
  }
};

export const getAllArticles = async (req, res) => {
  try {
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
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch articles" });
  }
};

export const getArticleDetails = async (req, res) => {
  const { articleId } = req.params;
  try {
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
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch article details" });
  }
};

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
       ORDER BY a.created_at ASC`,
    );

    res.json({ success: true, data: rows });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch pending articles" });
  }
};

export const approveArticle = async (req, res) => {
  const { articleId } = req.params;

  try {
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

    res.json({ success: true, message: "Article approved" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Approval failed" });
  }
};

export const rejectArticle = async (req, res) => {
  const { articleId } = req.params;

  try {
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

    res.json({ success: true, message: "Article rejected" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Rejection failed" });
  }
};

export const deleteArticle = async (req, res) => {
  const { articleId } = req.params;

  try {
    // First, get the article to fetch image URL before deletion
    const articleQuery = await db.query(
      `SELECT image_url FROM articles WHERE article_id = $1`,
      [articleId],
    );

    if (articleQuery.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Article not found",
      });
    }

    const article = articleQuery.rows[0];
    const imageUrl = article.image_url;

    // Delete image from Cloudinary if it exists (before database deletion)
    if (imageUrl && imageUrl.includes("cloudinary.com")) {
      try {
        await deleteImageByUrl(imageUrl);
      } catch (deleteErr) {
        // Log error but don't fail the request if deletion fails
        console.error("Failed to delete image from Cloudinary:", deleteErr);
      }
    }

    // Delete the article from database
    const { rowCount } = await db.query(
      `DELETE FROM articles WHERE article_id = $1`,
      [articleId],
    );

    if (!rowCount) {
      return res.status(404).json({
        success: false,
        message: "Article not found",
      });
    }

    res.json({ success: true, message: "Article deleted successfully" });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ success: false, message: "Failed to delete article" });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const { role = "all", search = "", page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    let whereClause = "WHERE 1=1";
    const params = [];
    let paramIndex = 1;

    if (role && role !== "all") {
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
        avatar_url AS avatar,
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
  } catch (err) {
    console.error("getAllUsers error:", err);

    if (err.code === "42703") {
      return res.status(500).json({
        success: false,
        message: "Database column error. Please check users table schema.",
      });
    }

    res.status(500).json({ success: false, message: "Failed to fetch users" });
  }
};

export const getUserDetails = async (req, res) => {
  const { userId } = req.params;
  try {
    const userQuery = await db.query(
      `SELECT id, username, name, email, avatar_url AS avatar, role, bio, expertise, gender, country, portfolio_url, x_url, linkedin_url, facebook_url, instagram_url, joined_at
       FROM users WHERE id = $1`,
      [userId],
    );

    if (!userQuery.rows.length) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
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
  } catch (err) {
    console.error("getUserDetails error:", err);

    if (err.code === "42703") {
      return res.status(500).json({
        success: false,
        message: "Database column error. Please check users table schema.",
      });
    }

    res
      .status(500)
      .json({ success: false, message: "Failed to fetch user details" });
  }
};

export const updateUserRole = async (req, res) => {
  const { userId } = req.params;
  const { role } = req.body;
  const adminId = req.session.userId;

  if (!["user", "admin"].includes(role)) {
    return res.status(400).json({ success: false, message: "Invalid role" });
  }

  // Prevent admin from changing their own role
  if (parseInt(userId) === adminId) {
    return res.status(400).json({
      success: false,
      message: "Cannot change your own role",
    });
  }

  try {
    const { rowCount } = await db.query(
      `UPDATE users SET role = $1 WHERE id = $2`,
      [role, userId],
    );

    if (!rowCount) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    res.json({ success: true, message: `User role updated to ${role}` });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ success: false, message: "Failed to update user role" });
  }
};

export const deleteUser = async (req, res) => {
  const { userId } = req.params;
  const adminId = req.session.userId;

  // Prevent admin from deleting themselves
  if (parseInt(userId) === adminId) {
    return res.status(400).json({
      success: false,
      message: "Cannot delete your own account",
    });
  }

  try {
    // First, get user's articles and avatar URL before deletion
    const articlesQuery = await db.query(
      `SELECT image_url FROM articles WHERE author_id = $1 AND image_url IS NOT NULL`,
      [userId],
    );

    const userQuery = await db.query(
      `SELECT avatar_url FROM users WHERE id = $1`,
      [userId],
    );

    if (userQuery.rows.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // Delete user's articles (database only, Cloudinary cleanup below)
    await db.query(`DELETE FROM articles WHERE author_id = $1`, [userId]);

    // Delete article images from Cloudinary
    for (const article of articlesQuery.rows) {
      if (article.image_url && article.image_url.includes("cloudinary.com")) {
        try {
          await deleteImageByUrl(article.image_url);
        } catch (deleteErr) {
          console.error(
            "Failed to delete article image from Cloudinary:",
            deleteErr,
          );
        }
      }
    }

    // Delete user avatar from Cloudinary if it exists
    const user = userQuery.rows[0];
    if (user.avatar_url && user.avatar_url.includes("cloudinary.com")) {
      try {
        await deleteImageByUrl(user.avatar_url);
      } catch (deleteErr) {
        console.error("Failed to delete avatar from Cloudinary:", deleteErr);
      }
    }

    // Then delete user
    const { rowCount } = await db.query(`DELETE FROM users WHERE id = $1`, [
      userId,
    ]);

    if (!rowCount) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    res.json({ success: true, message: "User deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Failed to delete user" });
  }
};
