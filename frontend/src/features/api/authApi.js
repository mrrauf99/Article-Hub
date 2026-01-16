import { apiClient } from "./apiClient";

export const authApi = {
  login: (data) => apiClient.post("auth/login", data),

  signup: (data) => apiClient.post("auth/register", data),

  checkEmail: (data) => apiClient.post("auth/check-email", data),

  checkUsername: (data) => apiClient.post("auth/check-username", data),

  logout: () => apiClient.get("auth/logout"),

  verifyOTP: (data) => apiClient.post("auth/verify-otp", data),

  resendOTP: (data) => apiClient.post("auth/resend-otp", data),

  forgotPassword: (data) => apiClient.post("auth/forgot-password", data),

  resetPassword: (data) => apiClient.post("auth/reset-password", data),

  verifyTwoFactorLogin: (data) => apiClient.post("auth/2fa/verify-login", data),

  oauthComplete: (data) => apiClient.post("auth/oauth/complete", data),

  oauthSession: () => apiClient.get("auth/oauth-session"),

  otpSession: () => apiClient.get("auth/otp-session"),

  twoFactorSession: () => apiClient.get("auth/2fa-session"),

  session: () => apiClient.get("auth/session"),
};
