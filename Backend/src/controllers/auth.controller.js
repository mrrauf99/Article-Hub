import db from "../config/db.config.js";
import crypto from "crypto";
import bcrypt from "bcrypt";
import { sendEmailVerificationOtp } from "../services/email.service.js";

export async function signUp(req, res) {
  const { email, username, name, password, country } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(
      password,
      Number(process.env.SALT_ROUNDS)
    );

    const otp = crypto.randomInt(100000, 1000000).toString();

    await db.query(
      `INSERT INTO email_otps 
        (email, otp, name, username, password, country, expires_at)
       VALUES ($1,$2,$3,$4,$5,$6, NOW() + INTERVAL '5 minutes')`,
      [email, otp, name, username, hashedPassword, country]
    );

    await sendEmailVerificationOtp(email, otp);

    return res.status(200).json({
      success: true,
      message: "Verification code sent to your email. Please check your inbox.",
      email: email,
    });
  } catch (err) {
    console.error("SignUp server error:", err);

    return res.status(500).json({
      success: false,
      message: "Unable to create account. Please try again later.",
    });
  }
}

export async function resendOtp(req, res) {
  const { email } = req.body;

  try {
    const otp = crypto.randomInt(100000, 1000000).toString();

    const result = await db.query(
      `UPDATE email_otps SET otp = $1,
       expires_at = NOW() + INTERVAL '5 minutes' WHERE email = $2 RETURNING 1`,
      [otp, email]
    );

    if (result.rowCount === 0) {
      return res.status(200).json({
        success: false,
        message: "No pending verification found. Please sign up again.",
      });
    }

    await sendEmailVerificationOtp(email, otp);

    return res.status(200).json({
      success: true,
      message: "New verification code sent. Please check your email.",
    });
  } catch (err) {
    console.error("Resend OTP error:", err);
    return res.status(500).json({
      success: false,
      message: "Failed to send verification code. Please try again.",
    });
  }
}

export async function verifyOtp(req, res) {
  const { email, otp, flow } = req.body;

  try {
    const { rows } = await db.query(
      `SELECT *FROM email_otps WHERE email = $1 ORDER BY id DESC`,
      [email]
    );

    const record = rows[0];

    if (!record) {
      return res.status(200).json({
        success: false,
        message: "No verification code found. Please request a new one.",
      });
    }

    if (new Date(record.expires_at) < new Date()) {
      return res.status(200).json({
        success: false,
        message: "Verification code has expired. Please request a new one.",
      });
    }

    if (record.otp !== otp) {
      return res.status(200).json({
        success: false,
        message: "Incorrect verification code.",
      });
    }

    if (flow === "signup") {
      await db.query(
        "INSERT INTO users (username, email, name, password, country) VALUES ($1,$2,$3,$4,$5)",
        [
          record.username,
          record.email,
          record.name,
          record.password,
          record.country,
        ]
      );

      await db.query("DELETE FROM email_otps WHERE email = $1", [email]);
    }

    if (flow === "reset_password") {
      await db.query(
        `UPDATE email_otps SET is_verified = true WHERE email = $1`,
        [email]
      );
    }

    return res.status(200).json({
      success: true,
      message: "Account verified successfully!",
    });
  } catch (err) {
    console.error("OTP verify error:", err);
    return res.status(500).json({
      success: false,
      message: "Verification failed. Please try again.",
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

export async function forgetPassword(req, res) {
  const { email } = req.body;

  try {
    // Check if email exists
    const userResult = await db.query("SELECT id FROM users WHERE email = $1", [
      email,
    ]);

    if (userResult.rowCount === 0) {
      return res.status(200).json({
        success: false,
        message: "No account found with this email.",
      });
    }

    const otp = crypto.randomInt(100000, 1000000).toString();

    await db.query(
      `INSERT INTO email_otps (email, otp, expires_at)VALUES ($1,$2, NOW() + INTERVAL '5 minutes')`,
      [email, otp]
    );

    await sendEmailVerificationOtp(email, otp);

    return res.status(200).json({
      success: true,
      message: "Verification code sent to your email. Please check your inbox.",
      email: email,
    });
  } catch (err) {
    console.error("Forgot Password Error:", err);

    return res.status(500).json({
      success: false,
      message: "Failed to send verification code. Please try again.",
    });
  }
}

export async function resetPassword(req, res) {
  const { email, password: newPassword } = req.body;

  try {
    // Check if user exists
    const userResult = await db.query(
      "SELECT password FROM users WHERE email = $1",
      [email]
    );

    if (userResult.rowCount === 0) {
      return res.status(200).json({
        success: false,
        message: "We couldn't find an account with this email.",
      });
    }

    // Check OTP validity
    const { rowCount } = await db.query(
      "SELECT 1 FROM email_otps WHERE email = $1 AND is_verified = true",
      [email]
    );

    if (rowCount === 0) {
      return res.status(200).json({
        success: false,
        message: "Unauthorized or expired password reset request.",
      });
    }

    const currentHashedPassword = userResult.rows[0].password;

    // Compare new password with old password
    const isSamePassword = await bcrypt.compare(
      newPassword,
      currentHashedPassword
    );

    if (isSamePassword) {
      return res.status(200).json({
        success: false,
        message: "New password must be different from your current password.",
      });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(
      newPassword,
      Number(process.env.SALT_ROUNDS)
    );

    // Update password
    await db.query("UPDATE users SET password = $1 WHERE email = $2", [
      hashedPassword,
      email,
    ]);

    // Delete OTP record
    await db.query("DELETE FROM email_otps WHERE email = $1", [email]);

    return res.status(200).json({
      success: true,
      message: "Password reset successful.",
    });
  } catch (err) {
    console.error("Reset password error:", err);
    return res.status(500).json({
      success: false,
      message: "Unable to reset password. Please try again.",
    });
  }
}
