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
} from "../controllers/auth.controller.js";

import { authenticate } from "../middlewares/authenticate.middleware.js";
import { loginLimiter } from "../middlewares/rateLimiters.middleware.js";

import { COOKIE_NAMES } from "../constants/cookieNames.js";
import { generateToken } from "../utils/jwt.js";
import { setCookie } from "../config/cookie.js";

const authRoutes = Router();

// Register new user
authRoutes.post("/register", signUp);

// Verify OTP
authRoutes.post(
  "/signup/verify-otp",
  authenticate(COOKIE_NAMES.SIGNUP),
  verifyOtp,
);

authRoutes.post(
  "/password-reset/verify-otp",
  authenticate(COOKIE_NAMES.SIGNUP),
  verifyOtp,
);

// Resend OTP
authRoutes.post(
  "/signup/resend-otp",
  authenticate(COOKIE_NAMES.PASSWORD_RESET),
  resendOtp,
);

authRoutes.post(
  "/password-reset/resend-otp",
  authenticate(COOKIE_NAMES.PASSWORD_RESET),
  resendOtp,
);

// Login
authRoutes.post("/login", loginLimiter, login);

// Verify 2FA login
authRoutes.post(
  "/2fa/verify-login",
  authenticate(COOKIE_NAMES.TWO_FACTOR),
  verifyTwoFactorLogin,
);

// Logout user
authRoutes.get("/logout", (req, res) => {
  res.clearCookie(COOKIE_NAMES.ACCESS);

  res.status(200).json({
    success: true,
    message: "Logout successful",
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
  (req, res) => {
    const user = req.user;

    // Existing user
    if (user.id) {
      const token = generateToken({ type: "access", user }, "7d");
      setCookie(res, COOKIE_NAMES.ACCESS, token);

      // Redirect based on role
      const dashboardPath =
        user.role === "admin" ? "/admin/dashboard" : "/user/dashboard";
      return res.redirect(`${process.env.CLIENT_BASE_URL}${dashboardPath}`);
    }

    // New OAuth user, store temporary data
    const payload = {
      type: "oauth",
      user: {
        email: user.email,
        name: user.name,
        avatar: user.avatar,
        completed: false,
      },
    };

    const token = generateToken(payload, "5min");
    setCookie(res, COOKIE_NAMES.OAUTH, token);

    return res.redirect(`${process.env.CLIENT_BASE_URL}/complete-profile`);
  },
);

// Check if email already exists
authRoutes.post("/check-email", checkEmailAvailability);

// Check if username already exists
authRoutes.post("/check-username", checkUsernameAvailability);

// forgot-password
authRoutes.post("/forgot-password", forgetPassword);

// Reset password after OTP verification
authRoutes.post(
  "/password-reset",
  authenticate(COOKIE_NAMES.PASSWORD_RESET),
  passwordReset,
);

/* =========== FRONTEND LOADERS =========== */

// OTP session validation (OTP page)
authRoutes.get(
  "/otp-session",
  authenticate("emailVerificationToken"),
  (req, res) => {
    res.status(200).json({ success: true, email: req.user.email });
  },
);

// OAuth session validation (complete-profile)
authRoutes.get(
  "/oauth-session",
  authenticate(COOKIE_NAMES.OAUTH),
  (req, res) => {
    res.status(200).json({ success: true });
  },
);

// 2FA session validation (2FA page)
authRoutes.get(
  "/2fa-session",
  authenticate(COOKIE_NAMES.TWO_FACTOR),
  (req, res) => res.status(200).json({ success: true }),
);

authRoutes.get("/me", authenticate(COOKIE_NAMES.ACCESS), (req, res) => {
  res.json({
    success: true,
    role: req.user.role,
  });
});

export default authRoutes;
