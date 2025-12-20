import express from "express";
import passport from "passport";

import {
  signUp,
  verifyOtp,
  resendOtp,
  forgetPassword,
  resetPassword,
  checkEmailAvailability,
  checkUsernameAvailability,
} from "../controllers/auth.controller.js";

import { requireAuth } from "../middlewares/auth.middleware.js";

const authRoutes = express.Router();

// Register new user

authRoutes.post("/register", signUp);

// Verify OTP

authRoutes.post("/verify-otp", verifyOtp);

// Resend OTP

authRoutes.post("/resend-otp", resendOtp);

// Login with email/password

authRoutes.post("/login", (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    // Handle authentication errors
    if (err) {
      return res.status(500).json({
        success: false,
        message: "Authentication service error",
      });
    }

    // Authentication failed (invalid credentials or user not found)
    if (!user) {
      return res.status(200).json({
        success: false,
        message: info.message,
      });
    }

    // Log in the authenticated user
    req.logIn(user, (err) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: "Session creation failed",
        });
      }

      return res.status(200).json({
        success: true,
        message: "Login successful",
        user: {
          id: user.id,
        },
      });
    });
  })(req, res, next);
});

// Logout

authRoutes.post("/logout", (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: "Logout failed",
      });
    }
    res.status(200).json({
      success: true,
      message: "Logout successful",
    });
  });
});

/* -------------------------- GOOGLE AUTH ROUTES ------------------------ */

// Redirect to Google

authRoutes.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

// Google callback

authRoutes.get(
  "/google/callback",
  passport.authenticate("google", {
    session: true,
    failureRedirect: `${process.env.CLIENT_BASE_URL}/login?error=google_auth_failed`,
  }),
  (req, res) => {
    res.redirect(`${process.env.CLIENT_BASE_URL}/dashboard`);
  }
);

// Check authentication status
authRoutes.get("/me", requireAuth, (req, res) => {
  res.status(200).json({
    success: true,
    user: {
      id: req.user.id,
      username: req.user.username,
      email: req.user.email,
      name: req.user.name,
      avatar: req.user.avatar,
      country: req.user.country,
    },
  });
});

// Check email & username availability

authRoutes.post("/check-email", checkEmailAvailability);
authRoutes.post("/check-username", checkUsernameAvailability);

/* ------------------------ FORGOT PASSWORD FLOW ------------------------ */

// Request password reset (send OTP)

authRoutes.post("/forgot-password", forgetPassword);

// Reset password after OTP verification

authRoutes.post("/reset-password", resetPassword);
export default authRoutes;
