import db from "../config/db.config.js";
import crypto from "crypto";
import bcrypt from "bcrypt";
import { sendEmailVerificationOtp } from "../services/email.service.js";

export async function signUp(req, res) {
  const { email, username, name, password, country } = req.body;

  const hashedPassword = await bcrypt.hash(
    password,
    Number(process.env.SALT_ROUNDS)
  );

  const otp = crypto.randomInt(100000, 1000000).toString();

  req.session.otp = {
    flow: "signup",
    email,
    code: otp,
    expiresAt: Date.now() + 5 * 60 * 1000,
    verified: false,
    payload: {
      email,
      username,
      name,
      password: hashedPassword,
      country,
    },
  };

  await sendEmailVerificationOtp(email, otp);

  return res.status(200).json({
    success: true,
    message: "Verification code sent to your email.",
  });
}

export async function login(req, res) {
  const { identifier, password } = req.body;

  try {
    const { rows } = await db.query(
      "SELECT id, password FROM users WHERE email = $1 OR username = $1",
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
      });
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Something went wrong. Please try again later.",
    });
  }
}

export async function resendOtp(req, res) {
  try {
    const otpSession = req.session.otp;

    if (!otpSession) {
      return res.status(401).json({
        success: false,
        message: "Session expired. Please login again.",
      });
    }

    const otp = crypto.randomInt(100000, 1000000).toString();

    otpSession.code = otp;
    otpSession.expiresAt = Date.now() + 5 * 60 * 1000;
    otpSession.verified = false;

    await sendEmailVerificationOtp(otpSession.email, otp);

    return res.status(200).json({
      success: true,
      message: "New verification code sent.",
    });
  } catch (err) {
    console.error("Resend OTP error:", err);

    return res.status(500).json({
      success: false,
      message: "Failed to resend code. Please try again.",
    });
  }
}

export async function verifyOtp(req, res) {
  const { otp } = req.body;
  const sessionOtp = req.session.otp;

  if (!sessionOtp) {
    return res.status(401).json({
      success: false,
      message: "Verification session expired. Please request a new code.",
    });
  }

  if (Date.now() > sessionOtp.expiresAt) {
    req.session.destroy(() => {});
    return res.status(410).json({
      success: false,
      message: "OTP expired.",
    });
  }

  if (sessionOtp.code !== otp) {
    return res.status(400).json({
      success: false,
      message: "Invalid verification code.",
    });
  }

  // mark verified
  sessionOtp.verified = true;

  // SIGNUP FINALIZATION
  if (sessionOtp.flow === "signup") {
    const p = sessionOtp.payload;

    await db.query(
      "INSERT INTO users (email, username, name, password, country) VALUES ($1,$2,$3,$4,$5)",
      [p.email, p.username, p.name, p.password, p.country]
    );

    req.session.destroy(() => {});
  }

  res.status(200).json({
    success: true,
    next: sessionOtp.flow === "reset-password" ? "/reset-password" : "/login",
  });
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

  const { rowCount } = await db.query("SELECT 1 FROM users WHERE email = $1", [
    email,
  ]);

  if (!rowCount) {
    return res.status(404).json({
      success: false,
      message: "No account found with this email.",
    });
  }

  const otp = crypto.randomInt(100000, 1000000).toString();

  req.session.otp = {
    flow: "reset-password",
    email,
    code: otp,
    expiresAt: Date.now() + 5 * 60 * 1000,
    verified: false,
  };

  await sendEmailVerificationOtp(email, otp);

  res.status(200).json({
    success: true,
    message: "Verification code sent to your email.",
  });
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

  const { rows } = await db.query(
    `INSERT INTO users (email, name, username, avatar)
     VALUES ($1,$2,$3,$4) returning id`,
    [oauth.email, oauth.name, username, oauth.avatar]
  );

  oauth.completed = true;

  req.session.userId = rows[0].id;

  // destroy temp oauth data
  delete req.session.oauth;

  res.redirect(`${process.env.CLIENT_BASE_URL}/dashboard`);
}
