import { apiClient } from "./apiClient";

export const authApi = {
  login: (data) => apiClient.post("auth/login", data),

  signup: (data) => apiClient.post("auth/register", data),

  checkEmail: (data) => apiClient.post("auth/check-email", data),

  checkUsername: (data) => apiClient.post("auth/check-username", data),

  logout: () => apiClient.post("auth/logout"),

  // flow: "signup" | "password-reset"
  verifyOTP: (data, flow) => apiClient.post(`auth/${flow}/verify-otp`, data),

  // flow: "signup" | "password-reset"
  resendOTP: (flow) => apiClient.post(`auth/${flow}/resend-otp`),

  forgotPassword: (data) => apiClient.post("auth/forgot-password", data),

  passwordReset: (data) => apiClient.post("auth/password-reset", data),

  verifyTwoFactorLogin: (data) => apiClient.post("auth/2fa/verify-login", data),

  oauthComplete: (data) => apiClient.post("auth/oauth/complete", data),

  oauthStatus: () => apiClient.get("auth/oauth-status"),

  // Check if the signup or password reset flow is still active
  checkSignupStatus: () => apiClient.get("auth/signup-status"),

  checkPasswordResetStatus: () => apiClient.get("auth/password-reset-status"),

  checkTwoFactorStatus: () => apiClient.get("auth/2fa-status"),

  checkAuth: () => apiClient.get("auth/status"),
};
