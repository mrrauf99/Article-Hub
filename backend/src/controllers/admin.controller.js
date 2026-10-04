import {
  approveArticle as approveArticleRecord,
  deleteAdminArticle,
  deleteAdminUser,
  getAdminArticleDetails,
  getAdminArticles,
  getAdminUserDetails,
  getAdminUsers,
  getDashboardStats as fetchDashboardStats,
  getPendingArticles as fetchPendingArticles,
  getRecentActivity as fetchRecentActivity,
  rejectArticle as rejectArticleRecord,
} from "../services/admin.service.js";
import { deleteImageFromCloudinary } from "../services/cloudinary.service.js";
import { sendArticleStatusEmail } from "../services/email.service.js";

export const getDashboardStats = async (_req, res) => {
  const [stats, recent] = await Promise.all([
    fetchDashboardStats(),
    fetchRecentActivity(),
  ]);

  return res.json({
    success: true,
    data: {
      stats,
      recentArticles: recent.recentArticles,
      recentUsers: recent.recentUsers,
    },
  });
};

export const getDashboardSummary = async (_req, res) => {
  const stats = await fetchDashboardStats();
  return res.json({ success: true, data: { stats } });
};

export const getDashboardRecentActivity = async (_req, res) => {
  const recent = await fetchRecentActivity();
  return res.json({ success: true, data: recent });
};

export const getArticles = async (req, res) => {
  const data = await getAdminArticles(req.validated.query);
  return res.json({ success: true, data });
};

export const getArticleDetails = async (req, res) => {
  const article = await getAdminArticleDetails(req.params.articleId);
  if (!article) {
    return res.status(404).json({ success: false, message: "Article not found." });
  }
  return res.json({ success: true, data: article });
};

export const getPendingArticles = async (_req, res) => {
  const articles = await fetchPendingArticles();
  return res.json({ success: true, data: articles });
};

export const approveArticle = async (req, res) => {
  const article = await approveArticleRecord(req.params.articleId);
  if (!article) {
    return res.status(404).json({ success: false, message: "Article not found." });
  }

  if (article.author.email) {
    await sendArticleStatusEmail({
      to: article.author.email,
      name: article.author.name || "Author",
      articleTitle: article.title,
      status: "approved",
    });
  }

  return res.json({ success: true, message: "Article approved." });
};

export const rejectArticle = async (req, res) => {
  const reason = req.body.reason.trim();
  const article = await rejectArticleRecord(req.params.articleId);
  if (!article) {
    return res.status(404).json({ success: false, message: "Article not found." });
  }

  if (article.author.email) {
    await sendArticleStatusEmail({
      to: article.author.email,
      name: article.author.name || "Author",
      articleTitle: article.title,
      status: "rejected",
      reason,
    });
  }

  return res.json({ success: true, message: "Article rejected." });
};

export const deleteArticle = async (req, res) => {
  const reason = req.body.reason.trim();
  const article = await deleteAdminArticle(req.params.articleId);
  if (!article) {
    return res.status(404).json({ success: false, message: "Article not found." });
  }

  try {
    await deleteImageFromCloudinary(article.imagePublicId);
  } catch (deleteErr) {
    console.error("Failed to delete image from Cloudinary:", deleteErr);
  }

  if (article.author.email) {
    await sendArticleStatusEmail({
      to: article.author.email,
      name: article.author.name || "Author",
      articleTitle: article.title,
      status: "deleted",
      reason,
    });
  }

  return res.json({ success: true, message: "Article deleted." });
};

export const getUsers = async (req, res) => {
  const data = await getAdminUsers(req.validated.query);
  return res.json({ success: true, data });
};

export const getUserDetails = async (req, res) => {
  const data = await getAdminUserDetails(req.params.userId);
  if (!data) {
    return res.status(404).json({ success: false, message: "User not found." });
  }
  return res.json({ success: true, data });
};

export const deleteUser = async (req, res) => {
  const { userId } = req.params;
  const adminId = req.user.userId;

  if (userId === adminId) {
    return res.status(400).json({ success: false, message: "You can't delete your own account." });
  }

  const user = await deleteAdminUser(userId);
  if (!user) {
    return res.status(404).json({ success: false, message: "User not found." });
  }

  const deleteResults = await Promise.allSettled(
    user.articles.map((article) => deleteImageFromCloudinary(article.imagePublicId)),
  );
  deleteResults.forEach((result) => {
    if (result.status === "rejected") {
      console.error("Failed to delete article image from Cloudinary:", result.reason);
    }
  });

  if (user.avatarPublicId) {
    try {
      await deleteImageFromCloudinary(user.avatarPublicId);
    } catch (deleteErr) {
      console.error("Failed to delete avatar from Cloudinary:", deleteErr);
    }
  }

  return res.json({ success: true, message: "Member deleted." });
};
