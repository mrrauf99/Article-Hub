import { apiClient } from "./apiClient";

export const userApi = {
  changePassword: (data) => apiClient.post("user/change-password", data),

  twoFactorSetup: (data) => apiClient.post("user/2fa/setup", data),
  twoFactorVerify: (data) => apiClient.post("user/2fa/verify", data),
  twoFactorDisable: (data) => apiClient.post("user/2fa/disable", data),

  deleteArticle: (articleId) => apiClient.delete(`articles/${articleId}`),
};
