import db from "../config/db.config.js";
import cloudinary from "../config/cloudinary.config.js";
import { deleteImageByUrl } from "../utils/cloudinary.utils.js";
import { validateArticleData } from "../utils/validation.utils.js";

export const getApprovedArticles = async (req, res) => {
  try {
    const { category } = req.query || {};

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

export const getArticleById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.session?.userId ?? null;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Article ID is required",
      });
    }
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

export const createArticle = async (req, res) => {
  try {
    const { title, introduction, content, summary, category } = req.body;

    // Validate article data
    const validationErrors = validateArticleData({
      title,
      introduction,
      content,
      summary,
      category,
    });

    if (validationErrors.length > 0) {
      return res.status(400).json({
        success: false,
        message: validationErrors.join(", "),
      });
    }

    let imageUrl = null;

    if (req.file) {
      try {
        // Validate file type
        if (!req.file.mimetype.startsWith("image/")) {
          return res.status(400).json({
            success: false,
            message: "Only image files are allowed",
          });
        }

        const base64 = req.file.buffer.toString("base64");
        const dataUri = `data:${req.file.mimetype};base64,${base64}`;

        const result = await cloudinary.uploader.upload(dataUri, {
          folder: "article_hub/articles",
          resource_type: "image",
          transformation: [
            { quality: "auto", fetch_format: "auto" },
          ],
        });

        imageUrl = result.secure_url;
      } catch (uploadErr) {
        console.error("Image upload error:", uploadErr);
        return res.status(500).json({
          success: false,
          message: "Failed to upload image. Please try again.",
        });
      }
    }

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
    
    // Handle database errors
    if (err.code === "23505") {
      // Unique constraint violation
      return res.status(400).json({
        success: false,
        message: "Article with this title already exists",
      });
    }
    
    if (err.code === "23503") {
      // Foreign key constraint violation
      return res.status(400).json({
        success: false,
        message: "Invalid data provided",
      });
    }

    res.status(500).json({
      success: false,
      message: "Article creation failed. Please try again.",
    });
  }
};

export const updateArticle = async (req, res) => {
  try {
    const { articleId: id } = req.params;
    const { title, introduction, content, summary, category, existingImageUrl } =
      req.body;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Article ID is required",
      });
    }

    // Validate article data
    const validationErrors = validateArticleData({
      title,
      introduction,
      content,
      summary,
      category,
    });

    if (validationErrors.length > 0) {
      return res.status(400).json({
        success: false,
        message: validationErrors.join(", "),
      });
    }
    // First, get the current article to check existing image
    const currentArticleQuery = await db.query(
      `SELECT image_url, author_id FROM articles WHERE article_id = $1`,
      [id]
    );

    if (currentArticleQuery.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Article not found.",
      });
    }

    const currentArticle = currentArticleQuery.rows[0];

    // Check if user is the author
    if (currentArticle.author_id !== req.session.userId) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to update this article.",
      });
    }

    let imageUrl = existingImageUrl || currentArticle.image_url || null;
    const oldImageUrl = currentArticle.image_url;

    if (req.file) {
      try {
        const base64 = req.file.buffer.toString("base64");
        const dataUri = `data:${req.file.mimetype};base64,${base64}`;

        const result = await cloudinary.uploader.upload(dataUri, {
          folder: "article_hub/articles",
          resource_type: "image",
          transformation: [
            { quality: "auto", fetch_format: "auto" },
          ],
        });

        imageUrl = result.secure_url;

        // Delete old image from Cloudinary if it exists and is different from new one
        if (
          oldImageUrl &&
          oldImageUrl !== imageUrl &&
          oldImageUrl.includes("cloudinary.com")
        ) {
          try {
            await deleteImageByUrl(oldImageUrl);
          } catch (deleteErr) {
            // Log error but don't fail the request if deletion fails
            console.error("Failed to delete old image from Cloudinary:", deleteErr);
          }
        }
      } catch (uploadErr) {
        console.error("Image upload error:", uploadErr);
        return res.status(500).json({
          success: false,
          message: "Failed to upload image.",
        });
      }
    } else if (existingImageUrl === null || existingImageUrl === "") {
      // If no new file and existingImageUrl is explicitly null/empty, delete old image
      if (oldImageUrl && oldImageUrl.includes("cloudinary.com")) {
        try {
          await deleteImageByUrl(oldImageUrl);
        } catch (deleteErr) {
          console.error("Failed to delete old image from Cloudinary:", deleteErr);
        }
      }
      imageUrl = null;
    }

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
        id,
        req.session.userId,
      ]
    );

    if (!rowCount) {
      return res.status(403).json({
        success: false,
        message: "Failed to update article.",
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

export const deleteArticle = async (req, res) => {
  const { articleId: id } = req.params;

  try {
    // First, get the article to check if it exists and get the image URL
    const articleQuery = await db.query(
      `SELECT image_url, author_id FROM articles WHERE article_id = $1`,
      [id]
    );

    if (articleQuery.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Article not found",
      });
    }

    const article = articleQuery.rows[0];

    // Check authorization
    if (article.author_id !== req.session.userId) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to delete this article",
      });
    }

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
      `DELETE FROM articles
       WHERE article_id = $1 AND author_id = $2`,
      [id, req.session.userId]
    );

    if (!rowCount) {
      return res.status(403).json({
        success: false,
        message: "Failed to delete article",
      });
    }

    res.json({ success: true, message: "Article deleted" });
  } catch (err) {
    console.error("Delete article error:", err);
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
      folder: "article_hub/articles",
      resource_type: "image",
      transformation: [
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

export const incrementArticleViews = async (req, res) => {
  const { id } = req.params;

  try {
    if (req.session?.userRole === "admin") {
      return res.status(200).json({
        success: true,
        message: "View not counted for admin",
      });
    }

    const { rowCount } = await db.query(
      `UPDATE articles 
       SET views = COALESCE(views, 0) + 1 
       WHERE article_id = $1 AND status = 'approved'`,
      [id]
    );

    if (!rowCount) {
      return res.status(404).json({
        success: false,
        message: "Article not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "View counted",
    });
  } catch (err) {
    console.error("incrementArticleViews error:", err);
    return res.status(500).json({
      success: false,
      message: "Failed to increment views",
    });
  }
};
