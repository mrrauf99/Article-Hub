import db from "../config/db.config.js";
import {
  deleteImageFromCloudinary,
  uploadImageToCloudinary,
  ARTICLE_IMAGE_OPTIONS,
} from "../services/cloudinary.service.js";
import { validateArticleData } from "../utils/validation.utils.js";

export const getApprovedArticles = async (req, res) => {
  const { category } = req.query;
  const pageNumber = Math.max(parseInt(req.query.page) || 1, 1);
  const limitNumber = Math.min(Math.max(parseInt(req.query.limit) || 9, 1), 45);
  const offset = (pageNumber - 1) * limitNumber;

  let query = `
      SELECT
        a.id,
        a.author_id,
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

  query += ` ORDER BY a.published_at DESC LIMIT $${values.length + 1} OFFSET $${
    values.length + 2
  }`;

  const totalCountQuery = db.query(
    `
      SELECT COUNT(*)::int AS count
      FROM articles a
      WHERE a.status = 'approved'
      ${category ? "AND a.category = $1" : ""}
      `,
    category ? [category] : [],
  );

  const overallCountQuery = db.query(`
      SELECT COUNT(*)::int AS count
      FROM articles
      WHERE status = 'approved'
    `);

  const authorCountQuery = db.query(`
      SELECT COUNT(DISTINCT author_id)::int AS count
      FROM articles
      WHERE status = 'approved'
    `);

  const categoryCountsQuery = db.query(`
      SELECT category, COUNT(*)::int AS count
      FROM articles
      WHERE status = 'approved'
      GROUP BY category
    `);

  const articlesQuery = db.query(query, [...values, limitNumber, offset]);

  const [
    totalCountResult,
    overallCountResult,
    authorCountResult,
    categoryCountResult,
    articlesResult,
  ] = await Promise.all([
    totalCountQuery,
    overallCountQuery,
    authorCountQuery,
    categoryCountsQuery,
    articlesQuery,
  ]);

  const totalCount = totalCountResult.rows[0]?.count || 0;
  const overallCount = overallCountResult.rows[0]?.count || 0;
  const authorCount = authorCountResult.rows[0]?.count || 0;

  return res.status(200).json({
    success: true,
    data: {
      articles: articlesResult.rows,
      pagination: {
        page: pageNumber,
        limit: limitNumber,
        totalCount,
        totalPages: Math.ceil(totalCount / limitNumber),
      },
      meta: {
        overallCount,
        authorCount,
        categoryCounts: categoryCountResult.rows,
      },
    },
  });
};

export const getMyArticles = async (req, res) => {
  const { rows } = await db.query(
    `
      SELECT
        a.id,
        a.title,
        a.summary,
        a.category,
        a.status,
        a.views,
        a.image_url,
        a.published_at,
        u.name AS author_name
      FROM articles a
      JOIN users u ON u.id = a.author_id
      WHERE a.author_id = $1
      ORDER BY a.created_at DESC
      `,
    [req.user.userId],
  );

  res.json({ success: true, data: rows });
};

export const getArticleById = async (req, res) => {
  const { articleId } = req.params;

  const { rows } = await db.query(
    `
      SELECT
        a.id,
        a.title,
        a.introduction,
        a.content,
        a.summary,
        a.category,
        a.status,
        a.published_at,
        a.image_url,
        a.views,
        u.name AS author_name
      FROM articles a
      JOIN users u ON u.id = a.author_id
      WHERE a.id = $1
        AND (
          a.status = 'approved'
          OR a.author_id = $2
        )
      `,
    [articleId, req.user?.userId],
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
};

export const createArticle = async (req, res) => {
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
    return res.status(422).json({
      success: false,
      errors: validationErrors,
    });
  }

  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: "No image file provided.",
    });
  }

  const uploadedImage = await uploadImageToCloudinary(
    req.file.buffer,
    ARTICLE_IMAGE_OPTIONS,
  );
  const imageUrl = uploadedImage.secure_url;
  const imagePublicId = uploadedImage.public_id;

  const { rows } = await db.query(
    `
      INSERT INTO articles
      (title, introduction, content, summary, category, image_url, image_public_id, author_id)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING id
      `,
    [
      title,
      introduction,
      content,
      summary,
      category,
      imageUrl,
      imagePublicId,
      req.user.userId,
    ],
  );

  res.status(201).json({
    success: true,
    message: "Article submitted for approval.",
    articleId: rows[0].id,
  });
};

export const updateArticle = async (req, res) => {
  const { article } = req;
  const { articleId } = req.params;
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
    return res.status(422).json({
      success: false,
      errors: validationErrors,
    });
  }

  let imageUrl = article.image_url;
  let imagePublicId = article.image_public_id;

  // Upload the new image, if provided
  if (req.file) {
    const uploadedImage = await uploadImageToCloudinary(
      req.file.buffer,
      ARTICLE_IMAGE_OPTIONS,
    );
    imageUrl = uploadedImage.secure_url;
    imagePublicId = uploadedImage.public_id;

    const oldImagePublicId = article.image_public_id;

    // Delete old image after successful update
    try {
      await deleteImageFromCloudinary(oldImagePublicId);
    } catch (error) {
      console.error("Failed to delete old Cloudinary image:", error);
    }
  }

  await db.query(
    `
      UPDATE articles
      SET
        title = $1,
        introduction = $2,
        content = $3,
        summary = $4,
        category = $5,
        image_url = $6,
        image_public_id = $7,
        status = 'pending',
        published_at = NULL
      WHERE id = $8
      `,
    [
      title,
      introduction,
      content,
      summary,
      category,
      imageUrl,
      imagePublicId,
      articleId,
    ],
  );

  res.json({
    success: true,
    message: "Article updated and sent for review.",
  });
};

export const deleteArticle = async (req, res) => {
  const { articleId } = req.params;
  const { article } = req;

  // Delete the article from database
  await db.query(
    `DELETE FROM articles
       WHERE id = $1`,
    [articleId],
  );

  const imagePublicId = article.image_public_id;

  // Delete image from Cloudinary

  try {
    await deleteImageFromCloudinary(imagePublicId);
  } catch (error) {
    console.error("Failed to delete old Cloudinary image:", error);
  }

  res.json({ success: true, message: "Article deleted." });
};

export const incrementArticleViews = async (req, res) => {
  const { articleId } = req.params;
  const userId = req.user?.userId;

  const { rowCount } = await db.query(
    `
    UPDATE articles SET views = views + 1 WHERE id = $1 
    AND status = 'approved' AND author_id != $2 RETURNING id
    `,
    [articleId, userId],
  );

  if (rowCount === 0) {
    return res.status(404).json({
      success: false,
      message: "Article not found or view not counted.",
    });
  }

  return res.json({
    success: true,
    message: "View counted.",
  });
};
