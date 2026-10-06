import { apiClient } from "./apiClient";

export const savedArticlesApi = {
  getAll: (params, signal) => apiClient.get("saved-articles", { params, signal }),
  save: (articleId) =>
    apiClient.post(`saved-articles/${articleId}`, null, {
      headers: { "X-Requested-With": "XMLHttpRequest" },
    }),
  unsave: (articleId) =>
    apiClient.delete(`saved-articles/${articleId}`, {
      headers: { "X-Requested-With": "XMLHttpRequest" },
    }),
};
