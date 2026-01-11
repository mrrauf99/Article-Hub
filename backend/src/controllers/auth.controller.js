import db from "../config/db.config.js";
import crypto from "crypto";
import bcrypt from "bcrypt";
import { sendEmailVerificationOtp } from "../services/email.service.js";

const OTP_TTL_MS = 5 * 60 * 1000;
const OTP_HASH_ROUNDS = 10;
const MAX_VERIFY_ATTEMPTS = 5;
const MAX_RESEND_COUNT = 3;

export async function signUp(req, res) {
  try {
    const { email, username, name, password, country } = req.body;

    const hashedPassword = await bcrypt.hash(
      password,
      Number(process.env.SALT_ROUNDS)
    );

    const otp = crypto.randomInt(100000, 1000000).toString();
    const otpHash = await bcrypt.hash(otp, OTP_HASH_ROUNDS);

    req.session.otp = {
      flow: "signup",
      email,
      code: otpHash,
      expiresAt: Date.now() + OTP_TTL_MS,
      attempts: 0,
      resendCount: 0,
      verified: false,
      payload: {
        email,
        username,
        name,
        password: hashedPassword,
        country,
      },
    };

    req.session.cookie.maxAge = OTP_TTL_MS;

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
    const otpHash = await bcrypt.hash(otp, OTP_HASH_ROUNDS);

    req.session.otp = {
      flow: "reset-password",
      email,
      code: otpHash,
      expiresAt: Date.now() + OTP_TTL_MS,
      attempts: 0,
      resendCount: 0,
      verified: false,
    };

    req.session.cookie.maxAge = OTP_TTL_MS;

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
  const oldOtp = req.session.otp;

  if (!oldOtp) {
    return res.status(401).json({
      success: false,
      message: "Session expired. Please start again.",
    });
  }

  const currentResendCount = oldOtp.resendCount || 0;

  if (currentResendCount >= MAX_RESEND_COUNT) {
    return res.status(429).json({
      success: false,
      message: "Maximum resend limit reached. Please start again.",
      resendsRemaining: 0,
    });
  }

  const otp = crypto.randomInt(100000, 1000000).toString();
  const hashedOtp = await bcrypt.hash(otp, OTP_HASH_ROUNDS);

  // Regenerate session to avoid stale attempts
  req.session.regenerate(async (err) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: "Failed to regenerate session.",
      });
    }

    const newResendCount = currentResendCount + 1;

    req.session.otp = {
      flow: oldOtp.flow,
      email: oldOtp.email,
      payload: oldOtp.payload,
      code: hashedOtp,
      expiresAt: Date.now() + OTP_TTL_MS,
      attempts: 0,
      resendCount: newResendCount,
      verified: false,
    };

    await sendEmailVerificationOtp(oldOtp.email, otp);

    res.json({
      success: true,
      message: "New verification code sent.",
      resendsRemaining: MAX_RESEND_COUNT - newResendCount,
    });
  });
}

export async function verifyOtp(req, res) {
  const { otp } = req.body;
  const otpSession = req.session.otp;

  if (!otpSession) {
    return res.status(401).json({
      success: false,
      message: "Verification session expired.",
    });
  }

  if (Date.now() > otpSession.expiresAt) {
    req.session.destroy(() => {});
    return res.status(410).json({
      success: false,
      message: "OTP expired. Please request a new one.",
    });
  }

  if (otpSession.attempts >= MAX_VERIFY_ATTEMPTS) {
    return res.status(429).json({
      success: false,
      message: "Too many attempts. Please request a new code.",
      attemptsRemaining: 0,
    });
  }

  const isValid = await bcrypt.compare(otp, otpSession.code);

  if (!isValid) {
    otpSession.attempts += 1;
    const remaining = MAX_VERIFY_ATTEMPTS - otpSession.attempts;
    return res.status(400).json({
      success: false,
      message: `Invalid verification code. ${remaining} attempt${
        remaining !== 1 ? "s" : ""
      } remaining.`,
      attemptsRemaining: remaining,
    });
  }

  // SUCCESS
  otpSession.verified = true;

  if (otpSession.flow === "signup") {
    const p = otpSession.payload;

    try {
      await db.query(
        `
        INSERT INTO users (email, username, name, password, country)
        VALUES ($1, $2, $3, $4, $5)
        `,
        [p.email, p.username, p.name, p.password, p.country]
      );

      req.session.destroy(() => {});
    } catch (insertErr) {
      console.error("Error inserting user during signup:", insertErr);
      
      // Handle specific database errors
      if (insertErr.code === '42703') {
        return res.status(500).json({
          success: false,
          message: "Database column error. Please check users table schema.",
        });
      }
      
      if (insertErr.code === '23505') {
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
  }

  res.json({
    success: true,
    message: "OTP verified successfully.",
    next: otpSession.flow === "reset-password" ? "/reset-password" : "/login",
  });
}

export async function login(req, res) {
  const { identifier, password } = req.body;

  try {
    const { rows } = await db.query(
      "SELECT id, password, role FROM users WHERE email = $1 OR username = $1",
      [identifier]
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

    req.session.regenerate((err) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: "Session error. Please try again.",
        });
      }

      req.session.userId = user.id;
      req.session.cookie.maxAge = 7 * 24 * 60 * 60 * 1000;

      res.status(200).json({
        success: true,
        message: "Logged in successfully.",
        role: user.role,
      });
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Something went wrong. Please try again later.",
    });
  }
}

export async function checkEmailAvailability(req, res) {
  const { email } = req.body;

  try {
    const { rowCount } = await db.query(
      "SELECT 1 FROM users WHERE email = $1",
      [email]
    );

    if (rowCount > 0) {
      return res.status(200).json({
        success: true,
        available: false,
        message: "This email is already registered.",
      });
    }

    return res.status(200).json({
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
      [username]
    );

    if (rowCount > 0) {
      return res.status(200).json({
        success: true,
        available: false,
        message: "This username is already taken.",
      });
    }

    return res.status(200).json({
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

export async function resetPassword(req, res) {
  const { password } = req.body;
  const otp = req.session.otp;

  if (!otp.verified || otp.flow !== "reset-password") {
    return res.status(401).json({
      success: false,
      message: "Unauthorized reset attempt.",
    });
  }

  const { rows } = await db.query(
    "SELECT password FROM users WHERE email = $1",
    [otp.email]
  );

  if (rows.length > 0) {
    const isSamePassword = await bcrypt.compare(password, rows[0].password);
    if (isSamePassword) {
      return res.status(400).json({
        success: false,
        message: "New password cannot be the same as the old password.",
      });
    }
  }

  const hashedPassword = await bcrypt.hash(
    password,
    Number(process.env.SALT_ROUNDS)
  );

  await db.query("UPDATE users SET password = $1 WHERE email = $2", [
    hashedPassword,
    otp.email,
  ]);

  req.session.destroy(() => {});

  res.status(200).json({
    success: true,
    message: "Password reset successful.",
  });
}

export async function completeGoogleSignup(req, res) {
  const { username } = req.body;
  const oauth = req.session.oauth;

  if (!oauth || oauth.completed) {
    return res.status(401).json({
      success: false,
      message: "OAuth session expired.",
    });
  }

  try {
    const { rows } = await db.query(
      `INSERT INTO users (email, name, username, avatar_url)
       VALUES ($1, $2, $3, $4) RETURNING id`,
      [oauth.email, oauth.name, username, oauth.avatar]
    );

    oauth.completed = true;

    req.session.userId = rows[0].id;

    // destroy temp oauth data
    delete req.session.oauth;

    res.redirect(`${process.env.CLIENT_BASE_URL}/user/dashboard`);
  } catch (insertErr) {
    console.error("Error inserting user during Google signup:", insertErr);
    
    // Handle specific database errors
    if (insertErr.code === '42703') {
      return res.status(500).json({
        success: false,
        message: "Database column error. Please check users table schema.",
      });
    }
    
    if (insertErr.code === '23505') {
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
