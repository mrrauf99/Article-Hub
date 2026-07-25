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
import { PASSWORD_MAX, PASSWORD_MIN } from "../utils/validation.utils.js";

const OTP_HASH_ROUNDS = process.env.SALT_ROUNDS;
const MAX_VERIFY_ATTEMPTS = 5;
const MAX_RESEND_COUNT = 3;

export async function signUp(req, res) {
  const { email, username, name, password, country } = req.body;

  const hashedPassword = await bcrypt.hash(
    password,
    Number(process.env.SALT_ROUNDS),
  );

  const otp = crypto.randomInt(100000, 1000000).toString();
  const hashedOtp = await bcrypt.hash(otp, OTP_HASH_ROUNDS);

  const payload = {
    type: "signup",
    auth: {
      hashedOtp,
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
  setCookie(res, COOKIE_NAMES.SIGNUP, token);

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
  const hashedOtp = await bcrypt.hash(otp, OTP_HASH_ROUNDS);

  const payload = {
    type: "forgot-password",
    auth: {
      code: hashedOtp,
      attempts: 0,
      resendCount: 0,
    },
    user: {
      email,
    },
  };

  const token = generateToken(payload, "5m");
  setCookie(res, COOKIE_NAMES.PASSWORD_RESET, token);

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
  const hashedOtp = await bcrypt.hash(otp, OTP_HASH_ROUNDS);

  const newResendCount = resendCount + 1;
  const payload = {
    type: req.type,
    user: req.user,
    auth: {
      ...req.auth,
      resendCount: newResendCount,
      hashedOtp,
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

  setCookie(res, tokenName, token);
  res.json({
    success: true,
    message: "New verification code sent.",
    resendsRemaining: MAX_RESEND_COUNT - newResendCount,
  });
}

export async function verifyOtp(req, res) {
  const { otp } = req.body;
  let { hashedOtp, attempts } = req.auth;

  if (attempts >= MAX_VERIFY_ATTEMPTS) {
    return res.status(429).json({
      success: false,
      message: "Too many attempts. Please request a new code.",
      attemptsRemaining: 0,
    });
  }

  const isValid = await bcrypt.compare(otp, hashedOtp);

  if (!isValid) {
    attempts++;
    const remaining = MAX_VERIFY_ATTEMPTS - attempts;
    return res.status(400).json({
      success: false,
      message: `Invalid verification code. ${remaining} attempt${
        remaining !== 1 ? "s" : ""
      } remaining.`,
      attemptsRemaining: remaining,
    });
  }

  if (req.type === "signup") {
    const { email, username, name, password, country } = req.user;

    try {
      await db.query(
        `
        INSERT INTO users (email, username, name, password, country)
        VALUES ($1, $2, $3, $4, $5)
        `,
        [email, username, name, password, country],
      );

      res.clearCookie(COOKIE_NAMES.SIGNUP);
    } catch (insertErr) {
      if (insertErr.code === "23505") {
        console.error("Error inserting user during signup:", insertErr);

        return res.status(400).json({
          success: false,
          message: "Email or username already exists.",
        });
      }

      throw insertErr;
    }
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
    setCookie(res, COOKIE_NAMES.TWO_FACTOR, token);

    return res.status(200).json({
      success: true,
      twoFactorRequired: true,
    });
  }

  const token = generateToken(payload, "7d");
  setCookie(res, COOKIE_NAMES.ACCESS, token);

  const ipAddress = req.ip;
  const userAgent = req.get("user-agent");

  sendLoginNotificationEmail({
    to: user.email,
    name: user.name,
    ipAddress,
    userAgent,
    loggedInAt: new Date(),
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
    loggedInAt: new Date(),
  });

  const payload = {
    type: "access",
    user: {
      userId,
      role,
    },
  };

  const token = generateToken(payload, "7d");
  setCookie(res, COOKIE_NAMES.ACCESS, token);

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

  // Validate password input
  if (!password || typeof password !== "string" || password.trim() === "") {
    return res.status(400).json({
      success: false,
      message: "Password is required.",
    });
  }

  const passwordLength = password.length;
  if (passwordLength < PASSWORD_MIN || passwordLength > PASSWORD_MAX) {
    return res.status(400).json({
      success: false,
      message: "Password must be between 8 and 64 characters.",
    });
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

  try {
    const { rows } = await db.query(
      `INSERT INTO users (email, name, username, avatar_url)
       VALUES ($1, $2, $3, $4) RETURNING id, role`,
      [email, name, username, avatar],
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
    setCookie(res, COOKIE_NAMES.ACCESS, token);
    res.clearCookie(COOKIE_NAMES.OAUTH);

    res.redirect(`${process.env.CLIENT_BASE_URL}/user/dashboard`);
  } catch (insertErr) {
    if (insertErr.code === "23505") {
      console.error("Error inserting user during Google signup:", insertErr);

      return res.status(400).json({
        success: false,
        message: "Username already taken. Please choose a different username.",
      });
    }

    throw insertErr;
  }
}

export async function googleOAuthCallback(req, res) {
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
}
