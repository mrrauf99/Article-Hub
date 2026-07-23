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

const OTP_HASH_ROUNDS = 12;
const MAX_VERIFY_ATTEMPTS = 5;
const MAX_RESEND_COUNT = 3;

export async function signUp(req, res) {
  try {
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
  } catch (err) {
    console.error("Signup error:", err);
    return res.status(500).json({
      success: false,
      message: "An unexpected error occurred. Please try again later.",
    });
  }
}

export async function forgetPassword(req, res) {
  try {
    const { email } = req.body;

    const { rowCount } = await db.query(
      "SELECT 1 FROM users WHERE email = $1",
      [email],
    );

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
  } catch (err) {
    console.error("Forget password error:", err);
    return res.status(500).json({
      success: false,
      message: "An unexpected error occurred. Please try again later.",
    });
  }
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
      console.error("Error inserting user during signup:", insertErr);

      // Handle specific database errors
      if (insertErr.code === "42703") {
        return res.status(500).json({
          success: false,
          message: "Database column error. Please check users table schema.",
        });
      }

      if (insertErr.code === "23505") {
        return res.status(400).json({
          success: false,
          message: "Email or username already exists.",
        });
      }

      return res.status(500).json({
        success: false,
        message: "Failed to create account. Please try again.",
      });
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

  try {
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
  } catch {
    res.status(500).json({
      success: false,
      message: "Something went wrong. Please try again later.",
    });
  }
}

export async function verifyTwoFactorLogin(req, res) {
  try {
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

    if (!rows.length) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    const user = rows[0];

    if (!user.two_factor_enabled || !user.two_factor_secret) {
      return res.status(400).json({
        success: false,
        message: "Two-factor authentication is not enabled.",
      });
    }

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
  } catch (err) {
    console.error("verifyTwoFactorLogin error:", err);
    return res.status(500).json({
      success: false,
      message: "Unable to verify 2FA. Please try again.",
    });
  }
}

export async function checkEmailAvailability(req, res) {
  const { email } = req.body;

  try {
    const { rowCount } = await db.query(
      "SELECT 1 FROM users WHERE email = $1",
      [email],
    );

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
  } catch (err) {
    console.error("Email availability error:", err);

    return res.status(500).json({
      success: false,
      message: "Unable to check email availability. Please try again.",
    });
  }
}

export async function checkUsernameAvailability(req, res) {
  const { username } = req.body;

  try {
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
  } catch (err) {
    console.error("Username availability error:", err);

    return res.status(500).json({
      success: false,
      message: "Unable to check username availability. Please try again.",
    });
  }
}

export async function passwordReset(req, res) {
  try {
    const { password } = req.body;
    const { email } = req.user;

    if (req.type !== "forgot-password") {
      return res.status(403).json({
        success: false,
        message: "Invalid password reset session.",
      });
    }

    // Validate password input
    if (!password || typeof password !== "string" || password.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Password is required.",
      });
    }

    const passwordLength = password.length;
    if (passwordLength < 8 || passwordLength > 64) {
      return res.status(400).json({
        success: false,
        message: "Password must be between 8 and 64 characters.",
      });
    }

    // Check if user exists and get current password
    const { rows } = await db.query(
      "SELECT password FROM users WHERE email = $1",
      [email],
    );

    if (rows.length === 0) {
      console.error("Reset password error: User not found", email);
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

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

    const updateResult = await db.query(
      "UPDATE users SET password = $1 WHERE email = $2",
      [hashedPassword, email],
    );

    if (updateResult.rowCount === 0) {
      console.error("Reset password error: Failed to update password");
      return res.status(500).json({
        success: false,
        message: "Failed to update password. Please try again.",
      });
    }

    res.clearCookie(COOKIE_NAMES.PASSWORD_RESET);

    return res.status(200).json({
      success: true,
      message: "Password reset successful.",
    });
  } catch (err) {
    console.error("Reset password error:", err);
    return res.status(500).json({
      success: false,
      message: err.message || "Unable to reset password. Please try again.",
    });
  }
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
    console.error("Error inserting user during Google signup:", insertErr);

    // Handle specific database errors
    if (insertErr.code === "42703") {
      return res.status(500).json({
        success: false,
        message: "Database column error. Please check users table schema.",
      });
    }

    if (insertErr.code === "23505") {
      return res.status(400).json({
        success: false,
        message: "Username already taken. Please choose a different username.",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to complete signup. Please try again.",
    });
  }
}
