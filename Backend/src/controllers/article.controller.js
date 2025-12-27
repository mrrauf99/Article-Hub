import db from "../config/db.config.js";
import cloudinary from "../config/cloudinary.config.js";

/**
 * GET all approved articles (public)
 * Optional query param: ?category=Technology
 */
export const getApprovedArticles = async (req, res) => {
  try {
    const { category } = req.query;

    let query = `
      SELECT
        a.article_id,
        a.title,
        a.introduction,
        a.category,
        a.published_at,
        a.image_url,
        a.views,
        a.summary,
        u.name AS author_name
      FROM articles a
      JOIN users u ON u.id = a.author_id
      WHERE a.status = 'approved'
    `;

    const values = [];

    // Optional category filter
    if (category) {
      query += ` AND a.category = $1`;
      values.push(category);
    }

    query += ` ORDER BY a.published_at DESC`;

    const { rows } = await db.query(query, values);

    return res.status(200).json({
      success: true,
      data: rows,
    });
  } catch (err) {
    console.error("getApprovedArticles error:", err);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch articles",
    });
  }
};

//  GET articles of logged-in user

export const getMyArticles = async (req, res) => {
  try {
    const { rows } = await db.query(
      `SELECT *
       FROM articles
       WHERE author_id = $1
       ORDER BY created_at DESC`,
      [req.session.userId]
    );

    res.json({ success: true, data: rows });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch your articles" });
  }
};

// GET single approved article by ID (public)

export const getArticleById = async (req, res) => {
  const { id } = req.params;
  const userId = req.session?.userId ?? null;

  try {
    const { rows } = await db.query(
      `
      SELECT
        a.article_id,
        a.title,
        a.introduction,
        a.content,
        a.summary,
        a.category,
        a.status,
        a.published_at,
        a.image_url as "imageUrl",
        a.views,
        u.name AS author_name
      FROM articles a
      JOIN users u ON u.id = a.author_id
      WHERE a.article_id = $1
        AND (
          a.status = 'approved'
          OR a.author_id = $2
        )
      `,
      [id, userId]
    );

    if (!rows.length) {
      return res.status(404).json({
        success: false,
        message: "Article not found.",
      });
    }

    return res.status(200).json({
      success: true,
      data: rows[0],
    });
  } catch (err) {
    console.error("getArticleById error:", err);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch article.",
    });
  }
};

// CREATE article

export const createArticle = async (req, res) => {
  const { title, introduction, content, summary, category, imageUrl } =
    req.body;

  try {
    const { rows } = await db.query(
      `
      INSERT INTO articles
        (title, introduction, content, summary, category, image_url, author_id)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING article_id
      `,
      [
        title,
        introduction,
        content,
        summary,
        category,
        imageUrl,
        req.session.userId,
      ]
    );

    res.status(201).json({
      success: true,
      message: "Article submitted for approval",
      articleId: rows[0].article_id,
    });
  } catch (err) {
    console.error("createArticle error:", err);
    res.status(500).json({
      success: false,
      message: "Article creation failed",
    });
  }
};

//  UPDATE article (owner only → resets status)

export const updateArticle = async (req, res) => {
  const { articleId } = req.params;
  const { title, introduction, content, summary, category, imageUrl } =
    req.body;

  try {
    const { rowCount } = await db.query(
      `
      UPDATE articles
      SET
        title = $1,
        introduction = $2,
        content = $3,
        summary = $4,
        category = $5,
        image_url = $6,
        status = 'pending',
        published_at = NULL
      WHERE article_id = $7
        AND author_id = $8
      `,
      [
        title,
        introduction,
        content,
        summary,
        category,
        imageUrl,
        articleId,
        req.session.userId,
      ]
    );

    if (!rowCount) {
      return res.status(403).json({
        success: false,
        message: "Not authorized or article not found.",
      });
    }

    res.json({
      success: true,
      message: "Article updated and sent for review.",
    });
  } catch (err) {
    console.error("updateArticle error:", err);
    res.status(500).json({
      success: false,
      message: "Update failed",
    });
  }
};

// DELETE article (owner only)

export const deleteArticle = async (req, res) => {
  const { articleId } = req.params;

  try {
    const { rowCount } = await db.query(
      `DELETE FROM articles
       WHERE article_id = $1 AND author_id = $2`,
      [articleId, req.session.userId]
    );

    if (!rowCount) {
      return res.status(403).json({
        success: false,
        message: "Not authorized or article not found",
      });
    }

    res.json({ success: true, message: "Article deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Delete failed" });
  }
};

export const uploadImageToCloudinary = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No image file provided",
      });
    }

    const base64 = req.file.buffer.toString("base64");
    const dataUri = `data:${req.file.mimetype};base64,${base64}`;

    const result = await cloudinary.uploader.upload(dataUri, {
      folder: "article-hub",
      resource_type: "image",
      transformation: [
        { width: 1200, height: 630, crop: "limit" },
        { quality: "auto", fetch_format: "auto" },
      ],
    });

    return res.status(200).json({
      success: true,
      imageUrl: result.secure_url,
    });
  } catch (err) {
    console.error("Cloudinary upload error:", err);
    return res.status(500).json({
      success: false,
      message: "Image upload failed",
    });
  }
};
