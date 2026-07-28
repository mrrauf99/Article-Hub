import db from "../config/db.config.js";
import crypto from "crypto";
import bcrypt from "bcrypt";
import speakeasy from "speakeasy";
import {
  sendEmailVerificationOtp,
  sendLoginNotificationEmail,
} from "../services/email.service.js";
import { generateToken } from "../utils/jwt.js";
import { setCookie } from "../config/cookie.js";
import { COOKIE_NAMES } from "../constants/cookieNames.js";
import {
  PASSWORD_MAX,
  PASSWORD_MIN,
  validateLength,
  validateSignupData,
} from "../utils/validation.utils.js";

const OTP_HASH_ROUNDS = process.env.SALT_ROUNDS;
const MAX_VERIFY_ATTEMPTS = 5;
const MAX_RESEND_COUNT = 3;

export async function signUp(req, res) {
  const { email, username, name, password, country } = req.body;

  const errors = validateSignupData({
    email,
    username,
    name,
    country,
    password,
  });
  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: errors,
    });
  }

  const { rowCount } = await db.query(
    "SELECT 1 FROM users WHERE email = $1 OR username = $2",
    [email, username],
  );

  if (rowCount > 0) {
    return res.status(400).json({
      success: false,
      message: "Email or username already exists.",
    });
  }

  const hashedPassword = await bcrypt.hash(
    password,
    Number(process.env.SALT_ROUNDS),
  );

  const otp = crypto.randomInt(100000, 1000000).toString();

  const payload = {
    type: "signup",
    auth: {
      otp,
      attempts: 0,
      resendCount: 0,
    },
    user: {
      email,
      username,
      name,
      password: hashedPassword,
      country,
    },
  };

  const token = generateToken(payload, "5m");
  setCookie(res, COOKIE_NAMES.SIGNUP, token, 5 * 60 * 1000);

  await sendEmailVerificationOtp(email, otp);

  res.json({
    success: true,
    message: "Verification code sent to your email.",
  });
}

export async function forgetPassword(req, res) {
  const { email } = req.body;

  const { rowCount } = await db.query("SELECT 1 FROM users WHERE email = $1", [
    email,
  ]);

  if (!rowCount) {
    return res.json({
      success: true,
      message: "If an account exists, a verification code has been sent.",
    });
  }

  const otp = crypto.randomInt(100000, 1000000).toString();

  const payload = {
    type: "forgot-password",
    auth: {
      otp,
      attempts: 0,
      resendCount: 0,
    },
    user: {
      email,
    },
  };

  const token = generateToken(payload, "5m");
  setCookie(res, COOKIE_NAMES.PASSWORD_RESET, token, 5 * 60 * 1000);

  await sendEmailVerificationOtp(email, otp);

  res.json({
    success: true,
    message: "Verification code sent to your email.",
  });
}

export async function resendOtp(req, res) {
  const { email } = req.user;
  const { resendCount } = req.auth;

  if (resendCount === MAX_RESEND_COUNT) {
    return res.status(429).json({
      success: false,
      message: "Maximum resend limit reached. Please start again.",
      resendsRemaining: 0,
    });
  }

  const otp = crypto.randomInt(100000, 1000000).toString();

  const newResendCount = resendCount + 1;
  const payload = {
    type: req.type,
    user: req.user,
    auth: {
      ...req.auth,
      resendCount: newResendCount,
      otp,
    },
  };

  await sendEmailVerificationOtp(email, otp);

  const token = generateToken(payload, "5m");

  let tokenName;
  if (req.type === "signup") {
    tokenName = COOKIE_NAMES.SIGNUP;
  } else {
    tokenName = COOKIE_NAMES.PASSWORD_RESET;
  }

  setCookie(res, tokenName, token, 5 * 60 * 1000);
  res.json({
    success: true,
    message: "New verification code sent.",
    resendsRemaining: MAX_RESEND_COUNT - newResendCount,
  });
}

export async function verifyOtp(req, res) {
  const { otp } = req.body;
  let { otp: originalOtp, attempts } = req.auth;

  if (attempts >= MAX_VERIFY_ATTEMPTS) {
    return res.status(429).json({
      success: false,
      message: "Too many attempts. Please request a new code.",
      attemptsRemaining: 0,
    });
  }

  const isValid = otp === originalOtp;

  if (!isValid) {
    const newAttempts = attempts + 1;
    const remaining = MAX_VERIFY_ATTEMPTS - newAttempts;
    const updatedPayload = {
      type: req.type,
      user: req.user,
      auth: { ...req.auth, attempts: newAttempts, originalOtp },
    };
    const newToken = generateToken(updatedPayload, "5m");
    const cookieName =
      req.type === "signup" ? COOKIE_NAMES.SIGNUP : COOKIE_NAMES.PASSWORD_RESET;
    setCookie(res, cookieName, newToken, 5 * 60 * 1000);
    return res.status(400).json({
      success: false,
      message: `Invalid code. ${remaining} attempt(s) remaining.`,
      attemptsRemaining: remaining,
    });
  }

  if (req.type === "signup") {
    const { email, username, name, password, country } = req.user;

    await db.query(
      `
        INSERT INTO users (email, username, name, password, country, auth_provider)
        VALUES ($1, $2, $3, $4, $5, $6)
        `,
      [email, username, name, password, country, "local"],
    );
    res.clearCookie(COOKIE_NAMES.SIGNUP);
  } else {
    res.clearCookie(COOKIE_NAMES.PASSWORD_RESET);
  }

  res.json({
    success: true,
    message: "OTP verified successfully.",
    next: req.type === "forgot-password" ? "/reset-password" : "/login",
  });
}

export async function login(req, res) {
  const { identifier, password } = req.body;

  const { rows } = await db.query(
    "SELECT id, password, role, email, name, two_factor_enabled FROM users WHERE email = $1 OR username = $1",
    [identifier],
  );

  if (!rows.length) {
    return res.status(401).json({
      success: false,
      message: "Invalid email or password.",
    });
  }

  const user = rows[0];
  const match = await bcrypt.compare(password, user.password);

  if (!match) {
    return res.status(401).json({
      success: false,
      message: "Invalid email or password.",
    });
  }

  const payload = {
    type: "access",
    user: {
      userId: user.id,
      role: user.role,
    },
  };

  if (user.two_factor_enabled) {
    const token = generateToken(payload, "5m");
    setCookie(res, COOKIE_NAMES.TWO_FACTOR, token, 5 * 60 * 1000);

    return res.status(200).json({
      success: true,
      twoFactorRequired: true,
    });
  }

  const token = generateToken(payload, "7d");
  setCookie(res, COOKIE_NAMES.ACCESS, token, 7 * 24 * 60 * 60 * 1000);

  const ipAddress = req.ip;
  const userAgent = req.get("user-agent");

  sendLoginNotificationEmail({
    to: user.email,
    name: user.name,
    ipAddress,
    userAgent,
  });

  res.json({
    success: true,
    message: "Logged in successfully.",
    role: user.role,
  });
}

export async function verifyTwoFactorLogin(req, res) {
  const { code } = req.body;
  const { userId, role } = req.user;

  if (!code) {
    return res.status(400).json({
      success: false,
      message: "Authentication code is required.",
    });
  }

  const { rows } = await db.query(
    "SELECT email, name, two_factor_secret FROM users WHERE id = $1",
    [userId],
  );

  const user = rows[0];

  const isValid = speakeasy.totp.verify({
    secret: user.two_factor_secret,
    encoding: "base32",
    code,
    window: 1,
  });

  if (!isValid) {
    return res.status(400).json({
      success: false,
      message: "Invalid authentication code.",
    });
  }

  const ipAddress = req.ip;
  const userAgent = req.get("user-agent");

  sendLoginNotificationEmail({
    to: user.email,
    name: user.name,
    ipAddress,
    userAgent,
  });

  const payload = {
    type: "access",
    user: {
      userId,
      role,
    },
  };

  const token = generateToken(payload, "7d");
  setCookie(res, COOKIE_NAMES.ACCESS, token, 7 * 24 * 60 * 60 * 1000);

  res.clearCookie(COOKIE_NAMES.TWO_FACTOR);

  return res.status(200).json({
    success: true,
    message: "Logged in successfully.",
    role: role,
  });
}

export async function checkEmailAvailability(req, res) {
  const { email } = req.body;

  const { rowCount } = await db.query("SELECT 1 FROM users WHERE email = $1", [
    email,
  ]);

  if (rowCount > 0) {
    return res.status(200).json({
      success: true,
      available: false,
      message: "This email is already registered.",
    });
  }

  return res.json({
    success: true,
    available: true,
    message: "Email is available.",
  });
}

export async function checkUsernameAvailability(req, res) {
  const { username } = req.body;

  const { rowCount } = await db.query(
    "SELECT 1 FROM users WHERE username = $1",
    [username],
  );

  if (rowCount > 0) {
    return res.json({
      success: true,
      available: false,
      message: "This username is already taken.",
    });
  }

  return res.json({
    success: true,
    available: true,
    message: "Username is available.",
  });
}

export async function passwordReset(req, res) {
  const { password } = req.body;
  const { email } = req.user;

  const passwordError = validateLength(
    password,
    PASSWORD_MIN,
    PASSWORD_MAX,
    "Password",
  );

  if (passwordError) {
    res.status(400).json({ success: false, message: passwordError });
  }

  // Get current password
  const { rows } = await db.query(
    "SELECT password FROM users WHERE email = $1",
    [email],
  );

  // Check if new password is different from old password
  const existingPassword = rows[0].password;
  if (existingPassword) {
    const isSamePassword = await bcrypt.compare(password, existingPassword);
    if (isSamePassword) {
      return res.status(400).json({
        success: false,
        message: "New password cannot be the same as the old password.",
      });
    }
  }

  // Hash and update password
  const saltRounds = Number(process.env.SALT_ROUNDS || 10);
  const hashedPassword = await bcrypt.hash(password, saltRounds);

  await db.query("UPDATE users SET password = $1 WHERE email = $2", [
    hashedPassword,
    email,
  ]);

  res.clearCookie(COOKIE_NAMES.PASSWORD_RESET);

  return res.status(200).json({
    success: true,
    message: "Password reset successful.",
  });
}

export async function completeGoogleSignup(req, res) {
  const { username } = req.body;
  const { email, name, avatar } = req.user;

  const randomPassword = crypto.randomBytes(32).toString("hex");
  const hashedPassword = await bcrypt.hash(
    randomPassword,
    Number(process.env.SALT_ROUNDS),
  );

  const { rows } = await db.query(
    `INSERT INTO users (email, name, username, avatar_url, password, auth_provider)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, role`,
    [email, name, username, avatar, hashedPassword, "google"],
  );
  const { id, role } = rows[0];
  const payload = {
    type: "access",
    user: {
      userId: id,
      role,
    },
  };

  const token = generateToken(payload, "7d");
  setCookie(res, COOKIE_NAMES.ACCESS, token, 7 * 24 * 60 * 60 * 1000);
  res.clearCookie(COOKIE_NAMES.OAUTH);

  return res.status(200).json({ success: true, redirectTo: "/user/dashboard" });
}

export async function googleOAuthCallback(req, res) {
  const user = req.user;

  // Existing user
  if (user.id) {
    const token = generateToken({ type: "access", user }, "7d");
    setCookie(res, COOKIE_NAMES.ACCESS, token, 7 * 24 * 60 * 60 * 1000);

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
  setCookie(res, COOKIE_NAMES.OAUTH, token, 5 * 60 * 1000);

  return res.redirect(`${process.env.CLIENT_BASE_URL}/complete-profile`);
}
