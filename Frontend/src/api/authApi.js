import { apiClient } from "./apiClient";

export const authApi = {
  login: (data) => apiClient.post("/login", data, { withCredentials: true }),

  signup: (data) => apiClient.post("/signup", data),

  checkEmail: (data) => apiClient.post("/auth/check-email", data),

  checkUsername: (data) => apiClient.post("/auth/check-username", data),

  logout: () => apiClient.post("/logout", {}, { withCredentials: true }),
};
