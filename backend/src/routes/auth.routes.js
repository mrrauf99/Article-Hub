import { Router } from "express";

import {
  signUp,
  login,
  verifyOtp,
  resendOtp,
  forgetPassword,
  passwordReset,
  checkEmailAvailability,
  checkUsernameAvailability,
  completeGoogleSignup,
  verifyTwoFactorLogin,
  googleOAuthCallback,
} from "../controllers/auth.controller.js";

import { authenticate } from "../middlewares/authenticate.middleware.js";
import { rateLimiter } from "../middlewares/rateLimiter.middleware.js";

import { COOKIE_NAMES } from "../constants/cookieNames.js";
import { clearCookie } from "../config/cookie.js";
import { validateRequest } from "../validations/common.validation.js";
import {
  emailAvailabilitySchema,
  googleCompleteSchema,
  loginSchema,
  otpSchema,
  passwordResetSchema,
  signUpSchema,
  twoFactorCodeSchema,
  usernameAvailabilitySchema,
  googleCredentialSchema,
} from "../validations/auth.validation.js";

const authRoutes = Router();

authRoutes.post(
  "/register",
  rateLimiter,
  validateRequest(signUpSchema, { format: "messageArray" }),
  signUp,
);

authRoutes.post(
  "/signup/verify-otp",
  rateLimiter,
  authenticate(COOKIE_NAMES.SIGNUP),
  validateRequest(otpSchema),
  verifyOtp,
);

authRoutes.post(
  "/password-reset/verify-otp",
  rateLimiter,
  authenticate(COOKIE_NAMES.PASSWORD_RESET),
  validateRequest(otpSchema),
  verifyOtp,
);

authRoutes.post(
  "/signup/resend-otp",
  rateLimiter,
  authenticate(COOKIE_NAMES.SIGNUP),
  resendOtp,
);

authRoutes.post(
  "/password-reset/resend-otp",
  rateLimiter,
  authenticate(COOKIE_NAMES.PASSWORD_RESET),
  resendOtp,
);

authRoutes.post("/login", rateLimiter, validateRequest(loginSchema), login);

authRoutes.post(
  "/2fa/verify-login",
  authenticate(COOKIE_NAMES.TWO_FACTOR),
  validateRequest(twoFactorCodeSchema),
  verifyTwoFactorLogin,
);

authRoutes.post("/logout", (req, res) => {
  clearCookie(res, COOKIE_NAMES.ACCESS);

  res.json({
    success: true,
    message: "Logout successful.",
  });
});

authRoutes.post(
  "/oauth/complete",
  authenticate(COOKIE_NAMES.OAUTH),
  validateRequest(googleCompleteSchema),
  completeGoogleSignup,
);

authRoutes.get("/google", (_req, res) => res.redirect(`${process.env.CLIENT_BASE_URL}/login`));
authRoutes.get("/google/callback", (_req, res) => res.redirect(`${process.env.CLIENT_BASE_URL}/login`));
authRoutes.post(
  "/google/callback",
  rateLimiter,
  validateRequest(googleCredentialSchema),
  googleOAuthCallback,
);

authRoutes.post(
  "/check-email",
  validateRequest(emailAvailabilitySchema),
  checkEmailAvailability,
);

authRoutes.post(
  "/check-username",
  validateRequest(usernameAvailabilitySchema),
  checkUsernameAvailability,
);

authRoutes.post(
  "/forgot-password",
  rateLimiter,
  validateRequest(emailAvailabilitySchema),
  forgetPassword,
);

authRoutes.post(
  "/password-reset",
  authenticate(COOKIE_NAMES.PASSWORD_RESET),
  validateRequest(passwordResetSchema),
  passwordReset,
);

authRoutes.get(
  "/signup-status",
  authenticate(COOKIE_NAMES.SIGNUP),
  (req, res) => {
    res.json({ success: true, email: req.user.email });
  },
);

authRoutes.get(
  "/password-reset-status",
  authenticate(COOKIE_NAMES.PASSWORD_RESET),
  (req, res) => {
    res.json({ success: true, email: req.user.email });
  },
);

authRoutes.get(
  "/oauth-status",
  authenticate(COOKIE_NAMES.OAUTH),
  (req, res) => {
    res.json({ success: true });
  },
);

authRoutes.get(
  "/2fa-status",
  authenticate(COOKIE_NAMES.TWO_FACTOR),
  (req, res) => res.json({ success: true }),
);

authRoutes.get("/status", authenticate(COOKIE_NAMES.ACCESS), (req, res) => {
  res.json({
    success: true,
    role: req.user.role,
  });
});

export default authRoutes;
