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

// Verify OTP
authRoutes.post(
  "/signup/verify-otp",
  rateLimiter,
  authenticate(COOKIE_NAMES.SIGNUP),
  verifyOtp,
);

authRoutes.post(
  "/password-reset/verify-otp",
  rateLimiter,
  authenticate(COOKIE_NAMES.PASSWORD_RESET),
  verifyOtp,
);

// Resend OTP
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

// Login
authRoutes.post("/login", rateLimiter, login);

// Verify 2FA login
authRoutes.post(
  "/2fa/verify-login",
  authenticate(COOKIE_NAMES.TWO_FACTOR),
  verifyTwoFactorLogin,
);

// Logout user
authRoutes.post("/logout", (req, res) => {
  clearCookie(res, COOKIE_NAMES.ACCESS);

  res.json({
    success: true,
    message: "Logout successful.",
  });
});

// Complete Google signup (username / profile completion)
authRoutes.post(
  "/oauth/complete",
  authenticate(COOKIE_NAMES.OAUTH),
  completeGoogleSignup,
);

// Redirect user to Google OAuth
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

// Check if email already exists
authRoutes.post("/check-email", checkEmailAvailability);

// Check if username already exists
authRoutes.post("/check-username", checkUsernameAvailability);

// forgot-password
authRoutes.post("/forgot-password", rateLimiter, forgetPassword);

// Password reset  after OTP verification
authRoutes.post(
  "/password-reset",
  authenticate(COOKIE_NAMES.PASSWORD_RESET),
  passwordReset,
);

/* =========== FRONTEND LOADERS =========== */

// Signup OTP session validation
authRoutes.get(
  "/signup-session",
  authenticate(COOKIE_NAMES.SIGNUP),
  (req, res) => {
    res.json({ success: true, email: req.user.email });
  },
);

// Password-reset OTP session validation
authRoutes.get(
  "/password-reset-session",
  authenticate(COOKIE_NAMES.PASSWORD_RESET),
  (req, res) => {
    res.json({ success: true, email: req.user.email });
  },
);

// OAuth session validation (complete-profile)
authRoutes.get(
  "/oauth-session",
  authenticate(COOKIE_NAMES.OAUTH),
  (req, res) => {
    res.json({ success: true });
  },
);

// 2FA session validation (2FA page)
authRoutes.get(
  "/2fa-session",
  authenticate(COOKIE_NAMES.TWO_FACTOR),
  (req, res) => res.json({ success: true }),
);

authRoutes.get("/me", authenticate(COOKIE_NAMES.ACCESS), (req, res) => {
  res.json({
    success: true,
    role: req.user.role,
  });
});

export default authRoutes;
