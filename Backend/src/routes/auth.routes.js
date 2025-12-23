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
} from "../controllers/auth.controller.js";

import { requireOAuthSession } from "../middlewares/oauth.middleware.js";
import { requireOtpSession } from "../middlewares/otp.middleware.js";
import { otpLimiter } from "../middlewares/rateLimit.middleware.js";

const authRoutes = Router();

// Register new user (signup + send OTP)
authRoutes.post("/register", otpLimiter, signUp);

// Verify signup OTP
authRoutes.post("/verify-otp", requireOtpSession, verifyOtp);

// Resend OTP (signup / reset)
authRoutes.post("/resend-otp", resendOtp);

// Login with email & password
authRoutes.post("/login", otpLimiter, login);

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
  })
);

// Google OAuth callback handler
authRoutes.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: "/login",
  }),
  (req, res) => {
    const user = req.user;

    // Existing user → login directly
    if (user.id) {
      req.session.userId = user.id;
      return res.redirect(`${process.env.CLIENT_BASE_URL}/dashboard`);
    }

    // New OAuth user → store temporary session
    req.session.oauth = {
      email: user.email,
      name: user.name,
      avatar: user.avatar,
      completed: false,
    };

    return res.redirect(`${process.env.CLIENT_BASE_URL}/complete-profile`);
  }
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

export default authRoutes;
