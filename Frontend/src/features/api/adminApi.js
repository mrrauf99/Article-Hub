import { apiClient } from "./apiClient.js";

export const adminApi = {
  // Dashboard
  getDashboardStats: () => apiClient.get("/api/admin/dashboard/stats"),

  // Articles
  getAllArticles: (params = {}) =>
    apiClient.get("/api/admin/articles", { params }),

  getArticleDetails: (articleId) =>
    apiClient.get(`/api/admin/articles/${articleId}`),

  approveArticle: (articleId) =>
    apiClient.patch(`/api/admin/articles/${articleId}/approve`),

  rejectArticle: (articleId) =>
    apiClient.patch(`/api/admin/articles/${articleId}/reject`),

  deleteArticle: (articleId) =>
    apiClient.delete(`/api/admin/articles/${articleId}`),

  // Users
  getAllUsers: (params = {}) => apiClient.get("/api/admin/users", { params }),

  getUserDetails: (userId) => apiClient.get(`/api/admin/users/${userId}`),

  updateUserRole: (userId, role) =>
    apiClient.patch(`/api/admin/users/${userId}/role`, { role }),

  deleteUser: (userId) => apiClient.delete(`/api/admin/users/${userId}`),
};
