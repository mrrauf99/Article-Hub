import { Router } from "express";
import passport from "passport";

import {
  signUp,
  login,
  verifyOtp,
  resendOtp,
  forgetPassword,
  resetPassword,
  checkEmailAvailability,
  checkUsernameAvailability,
  completeGoogleSignup,
  verifyTwoFactorLogin,
} from "../controllers/auth.controller.js";

import { requireOAuthSession } from "../middlewares/oauth.middleware.js";
import { requireOtpSession } from "../middlewares/otp.middleware.js";
import { loginLimiter } from "../middlewares/rateLimiters.middleware.js";

const authRoutes = Router();

// Register new user (signup + send OTP)
authRoutes.post("/register", signUp);

// Verify signup OTP (5 attempts per OTP, tracked in session)
authRoutes.post("/verify-otp", requireOtpSession, verifyOtp);

// Resend OTP (signup / reset) - no rate limit, resets attempt counter
authRoutes.post("/resend-otp", resendOtp);

// Login with email & password
authRoutes.post("/login", loginLimiter, login);

// Verify 2FA login
authRoutes.post("/2fa/verify-login", verifyTwoFactorLogin);

// Logout user and destroy session
authRoutes.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: "Logout failed",
      });
    }

    res.clearCookie("articlehub.sid");

    res.status(200).json({
      success: true,
      message: "Logout successful",
    });
  });
});

// Complete Google signup (username / profile completion)
authRoutes.post("/oauth/complete", requireOAuthSession, completeGoogleSignup);

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
  (req, res) => {
    const user = req.user;

    // Existing user → login directly
    if (user.id) {
      req.session.userId = user.id;
      if (user.role) {
        req.session.userRole = user.role;
      }
      // Redirect based on role
      const dashboardPath =
        user.role === "admin" ? "/admin/dashboard" : "/user/dashboard";
      return res.redirect(`${process.env.CLIENT_BASE_URL}${dashboardPath}`);
    }

    // New OAuth user → store temporary session
    req.session.oauth = {
      email: user.email,
      name: user.name,
      avatar: user.avatar,
      completed: false,
    };

    return res.redirect(`${process.env.CLIENT_BASE_URL}/complete-profile`);
  },
);

// Check if email already exists
authRoutes.post("/check-email", checkEmailAvailability);

// Check if username already exists
authRoutes.post("/check-username", checkUsernameAvailability);

// Start forgot-password flow (send OTP)
authRoutes.post("/forgot-password", forgetPassword);

// Reset password after OTP verification
authRoutes.post("/reset-password", requireOtpSession, resetPassword);

/* ========================= FRONTEND LOADERS ========================= */

// OTP session validation
authRoutes.get("/otp-session", requireOtpSession, (req, res) => {
  res.status(200).json({ success: true, email: req.session.otp.email });
});

// OAuth session validation
authRoutes.get("/oauth-session", requireOAuthSession, (req, res) => {
  res.status(200).json({ success: true });
});

// 2FA session validation
authRoutes.get("/2fa-session", (req, res) => {
  if (!req.session?.pending2fa) {
    return res.status(401).json({ success: false });
  }
  return res.status(200).json({ success: true });
});

// Auth session validation (no DB hit)
authRoutes.get("/session", (req, res) => {
  if (!req.session?.userId || !req.session?.userRole) {
    return res.status(401).json({ success: false });
  }
  return res.status(200).json({
    success: true,
    role: req.session.userRole,
  });
});

export default authRoutes;
