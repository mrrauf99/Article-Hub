import {
  createArticle as insertArticle,
  deleteArticle as removeArticle,
  getApprovedArticles as findApprovedArticles,
  getArticleById as findArticleById,
  getArticlesByAuthor,
  incrementArticleViews as addArticleView,
  updateArticle as saveArticleUpdate,
} from "../services/article.service.js";
import { sendPendingArticleEmail } from "../services/email.service.js";
import {
  deleteImageFromCloudinary,
  uploadImageToCloudinary,
  ARTICLE_IMAGE_OPTIONS,
} from "../services/cloudinary.service.js";

export const getApprovedArticles = async (req, res) => {
  const { category, page, limit } = req.validated.query;
  const data = await findApprovedArticles({
    category,
    page,
    limit,
    userId: req.user?.userId,
  });

  return res.status(200).json({ success: true, data });
};

export const getMyArticles = async (req, res) => {
  const articles = await getArticlesByAuthor(req.user.userId);
  return res.json({ success: true, data: articles });
};

export const getArticleById = async (req, res) => {
  const article = await findArticleById(req.params.articleId, req.user?.userId);
  if (!article) {
    return res.status(404).json({
      success: false,
      message: "Article not found.",
    });
  }

  return res.status(200).json({ success: true, data: article });
};

export const createArticle = async (req, res) => {
  const { title, introduction, content, summary, category } = req.body;

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
  let article;
  try {
    article = await insertArticle({
      title,
      introduction,
      content,
      summary,
      category,
      imageUrl: uploadedImage.secure_url,
      imagePublicId: uploadedImage.public_id,
      authorId: req.user.userId,
    });
  } catch (error) {
    try {
      await deleteImageFromCloudinary(uploadedImage.public_id);
    } catch (deleteError) {
      console.error("Failed to delete uploaded Cloudinary image:", deleteError);
    }
    throw error;
  }

  await sendPendingArticleEmail({
    articleTitle: title,
    authorName: article.author.name || article.author.email || "Unknown author",
  });

  return res.status(201).json({
    success: true,
    message: "Article submitted for approval.",
    articleId: article.id,
  });
};

export const updateArticle = async (req, res) => {
  const { article } = req;
  const { articleId } = req.params;
  const { title, introduction, content, summary, category } = req.body;

  let imageUrl = article.image_url;
  let imagePublicId = article.image_public_id;

  let uploadedImage;
  if (req.file) {
    uploadedImage = await uploadImageToCloudinary(
      req.file.buffer,
      ARTICLE_IMAGE_OPTIONS,
    );
    imageUrl = uploadedImage.secure_url;
    imagePublicId = uploadedImage.public_id;
  }

  let updated;
  try {
    updated = await saveArticleUpdate(articleId, {
      title,
      introduction,
      content,
      summary,
      category,
      imageUrl,
      imagePublicId,
    });
  } catch (error) {
    if (uploadedImage) {
      try {
        await deleteImageFromCloudinary(uploadedImage.public_id);
      } catch (deleteError) {
        console.error("Failed to delete uploaded Cloudinary image:", deleteError);
      }
    }
    throw error;
  }

  if (uploadedImage) {
    try {
      await deleteImageFromCloudinary(article.image_public_id);
    } catch (error) {
      console.error("Failed to delete old Cloudinary image:", error);
    }
  }

  await sendPendingArticleEmail({
    articleTitle: title,
    authorName: updated.author.name || updated.author.email || "Unknown author",
  });

  return res.json({
    success: true,
    message: "Article updated and sent for review.",
  });
};

export const deleteArticle = async (req, res) => {
  const article = await removeArticle(req.params.articleId);
  if (!article) {
    return res.status(404).json({ success: false, message: "Article not found." });
  }

  try {
    await deleteImageFromCloudinary(article.imagePublicId);
  } catch (error) {
    console.error("Failed to delete old Cloudinary image:", error);
  }

  return res.json({ success: true, message: "Article deleted." });
};

export const incrementArticleViews = async (req, res) => {
  const count = await addArticleView(req.params.articleId, req.user?.userId);
  if (count === 0) {
    return res.status(404).json({
      success: false,
      message: "Article not found or view not counted.",
    });
  }

  return res.json({ success: true, message: "View counted." });
};
