import { Router } from "express";
import passport from "passport";

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

const authRoutes = Router();

// Register new user
authRoutes.post("/register", rateLimiter, signUp);

// Verify OTP for signup
authRoutes.post(
  "/signup/verify-otp",
  rateLimiter,
  authenticate(COOKIE_NAMES.SIGNUP),
  verifyOtp,
);

// Verify OTP for password reset
authRoutes.post(
  "/password-reset/verify-otp",
  rateLimiter,
  authenticate(COOKIE_NAMES.PASSWORD_RESET),
  verifyOtp,
);

// Resend OTP for signup
authRoutes.post(
  "/signup/resend-otp",
  rateLimiter,
  authenticate(COOKIE_NAMES.SIGNUP),
  resendOtp,
);

// Resend OTP for password reset
authRoutes.post(
  "/password-reset/resend-otp",
  rateLimiter,
  authenticate(COOKIE_NAMES.PASSWORD_RESET),
  resendOtp,
);

// User login
authRoutes.post("/login", rateLimiter, login);

// Verify 2FA code during login
authRoutes.post(
  "/2fa/verify-login",
  authenticate(COOKIE_NAMES.TWO_FACTOR),
  verifyTwoFactorLogin,
);

// Logout user (clear access token cookie)
authRoutes.post("/logout", (req, res) => {
  clearCookie(res, COOKIE_NAMES.ACCESS);

  res.json({
    success: true,
    message: "Logout successful.",
  });
});

// Complete Google signup (username)
authRoutes.post(
  "/oauth/complete",
  authenticate(COOKIE_NAMES.OAUTH),
  completeGoogleSignup,
);

// Redirect user to Google OAuth provider
authRoutes.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  }),
);

// Google OAuth callback handler
authRoutes.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: `${process.env.CLIENT_BASE_URL}/login`,
  }),
  googleOAuthCallback,
);

// Check availability of email
authRoutes.post("/check-email", checkEmailAvailability);

// Check availability of username
authRoutes.post("/check-username", checkUsernameAvailability);

// Initiate forgot password request
authRoutes.post("/forgot-password", rateLimiter, forgetPassword);

// Reset password after OTP verification
authRoutes.post(
  "/password-reset",
  authenticate(COOKIE_NAMES.PASSWORD_RESET),
  passwordReset,
);

/* =========== FRONTEND LOADERS & TOKEN VERIFICATION =========== */

// Verify signup token status
authRoutes.get(
  "/signup-status",
  authenticate(COOKIE_NAMES.SIGNUP),
  (req, res) => {
    res.json({ success: true, email: req.user.email });
  },
);

// Verify password-reset token status
authRoutes.get(
  "/password-reset-status",
  authenticate(COOKIE_NAMES.PASSWORD_RESET),
  (req, res) => {
    res.json({ success: true, email: req.user.email });
  },
);

// Verify OAuth profile completion token status
authRoutes.get(
  "/oauth-status",
  authenticate(COOKIE_NAMES.OAUTH),
  (req, res) => {
    res.json({ success: true });
  },
);

// Verify 2FA token status
authRoutes.get(
  "/2fa-status",
  authenticate(COOKIE_NAMES.TWO_FACTOR),
  (req, res) => res.json({ success: true }),
);

// Check current user authentication status
authRoutes.get("/status", authenticate(COOKIE_NAMES.ACCESS), (req, res) => {
  res.json({
    success: true,
    role: req.user.role,
  });
});

export default authRoutes;
