import { apiClient } from "./apiClient";

export const authApi = {
  login: (data) => apiClient.post("/api/auth/login", data),

  signup: (data) => apiClient.post("/api/auth/register", data),

  checkEmail: (data) => apiClient.post("/api/auth/check-email", data),

  checkUsername: (data) => apiClient.post("/api/auth/check-username", data),

  logout: () => apiClient.get("/api/auth/logout"),

  verifyOTP: (data) => apiClient.post("/api/auth/verify-otp", data),

  resendOTP: (data) => apiClient.post("/api/auth/resend-otp", data),

  forgotPassword: (data) => apiClient.post("/api/auth/forgot-password", data),

  resetPassword: (data) => apiClient.post("/api/auth/reset-password", data),

  oauthComplete: (data) => apiClient.post("/api/auth/oauth/complete", data),

  oauthSession: () => apiClient.get("/api/auth/oauth-session"),

  otpSession: () => apiClient.get("/api/auth/otp-session"),
};
