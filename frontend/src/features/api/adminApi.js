import { apiClient } from "./apiClient.js";

export const adminApi = {
  // Dashboard
  getDashboardStats: () => apiClient.get("admin/dashboard/stats"),
  getDashboardSummary: () => apiClient.get("admin/dashboard/summary"),
  getDashboardRecent: () => apiClient.get("admin/dashboard/recent"),

  // Articles
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

  // Users
  getAllUsers: (params = {}) => apiClient.get("admin/users", { params }),

  getUserDetails: (userId) => apiClient.get(`admin/users/${userId}`),

  updateUserRole: (userId, role) =>
    apiClient.patch(`admin/users/${userId}/role`, { role }),

  deleteUser: (userId) => apiClient.delete(`admin/users/${userId}`),
};
