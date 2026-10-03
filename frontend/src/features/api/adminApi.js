import { apiClient } from "./apiClient.js";

export const adminApi = {
  getDashboardStats: () => apiClient.get("admin/dashboard/stats"),
  getDashboardSummary: () => apiClient.get("admin/dashboard/summary"),
  getDashboardRecent: () => apiClient.get("admin/dashboard/recent"),

  getAllArticles: (params = {}) => apiClient.get("admin/articles", { params }),

  getPendingArticles: () => apiClient.get("admin/articles/pending"),

  getArticleDetails: (articleId) =>
    apiClient.get(`admin/articles/${articleId}`),

  approveArticle: (articleId) =>
    apiClient.patch(`admin/articles/${articleId}/approve`),

  rejectArticle: (articleId, reason) =>
    apiClient.patch(`admin/articles/${articleId}/reject`, { reason }),

  deleteArticle: (articleId, reason) =>
    apiClient.delete(`admin/articles/${articleId}`, { data: { reason } }),

  getAllUsers: (params = {}) => apiClient.get("admin/users", { params }),

  getUserDetails: (userId) => apiClient.get(`admin/users/${userId}`),

  deleteUser: (userId) => apiClient.delete(`admin/users/${userId}`),
};
