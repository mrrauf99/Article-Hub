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

const router = express.Router();

// Register new user

router.post("/register", signUp);

// Verify OTP

router.post("/verify-otp", verifyOtp);

// Resend OTP

router.post("/resend-otp", resendOtp);

// Login with email/password

router.post("/login", (req, res, next) => {
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

router.post("/logout", (req, res) => {
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

router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

// Google callback

router.get(
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
router.get("/auth/me", (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({
      success: false,
      message: "Not authenticated",
    });
  }

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

router.post("/check-email", checkEmailAvailability);
router.post("/check-username", checkUsernameAvailability);

/* ------------------------ FORGOT PASSWORD FLOW ------------------------ */

// Request password reset (send OTP)

router.post("/forgot-password", forgetPassword);

// Reset password after OTP verification

router.post("/reset-password", resetPassword);

export default router;
