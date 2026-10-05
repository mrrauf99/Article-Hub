import crypto from "crypto";
import bcrypt from "bcrypt";
import speakeasy from "speakeasy";
import { OAuth2Client } from "google-auth-library";
import {
  sendEmailVerificationOtp,
  sendLoginNotificationEmail,
} from "../services/email.service.js";
import { generateToken } from "../utils/jwt.js";
import { setCookie, clearCookie } from "../config/cookie.js";
import { COOKIE_NAMES } from "../constants/cookieNames.js";
import {
  createGoogleUser,
  createSignupUser,
  findUserForGoogleLogin,
  findUserForLogin,
  getPasswordByEmail,
  getTwoFactorLoginUser,
  hasSignupConflict,
  isEmailTaken,
  isUsernameTaken,
  updatePasswordByEmail,
} from "../services/auth.service.js";

const MAX_VERIFY_ATTEMPTS = 5;
const MAX_RESEND_COUNT = 3;
const googleAuthClient = new OAuth2Client();

export async function signUp(req, res) {
  const { email, username, name, password, country } = req.body;

  if (await hasSignupConflict(email, username)) {
    return res.status(400).json({
      success: false,
      message: "That email or username is already taken.",
    });
  }

  const hashedPassword = await bcrypt.hash(
    password,
    Number(process.env.SALT_ROUNDS || 10),
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

  if (!(await isEmailTaken(email))) {
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
      message: "You've used all your resend attempts. Please start over.",
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
      message: `Invalid code. ${remaining} ${remaining === 1 ? "attempt" : "attempts"} remaining.`,
      attemptsRemaining: remaining,
    });
  }

  if (req.type === "signup") {
    const { email, username, name, password, country } = req.user;

    await createSignupUser({ email, username, name, password, country });
    clearCookie(res, COOKIE_NAMES.SIGNUP);
  }
  // For forgot-password, keep the passwordResetToken cookie alive —
  // it's still needed to authenticate the /reset-password step, which
  // clears it itself once the password is actually changed.

  res.json({
    success: true,
    message: "Code verified.",
    next: req.type === "forgot-password" ? "/reset-password" : "/login",
  });
}

export async function login(req, res) {
  const { identifier, password } = req.body;

  const user = await findUserForLogin(identifier);

  if (!user) {
    return res.status(401).json({
      success: false,
      message: "Invalid email or password.",
    });
  }

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

  if (user.twoFactorEnabled) {
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

  await sendLoginNotificationEmail({
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

  const user = await getTwoFactorLoginUser(userId);

  if (!user) {
    return res.status(401).json({ success: false, message: "Your session has expired. Please sign in again." });
  }

  const isValid = speakeasy.totp.verify({
    secret: user.twoFactorSecret,
    encoding: "base32",
    code,
    window: 1,
  });

  if (!isValid) {
    return res.status(400).json({
      success: false,
      message: "That code isn't valid. Please try again.",
    });
  }

  const ipAddress = req.ip;
  const userAgent = req.get("user-agent");

  await sendLoginNotificationEmail({
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

  clearCookie(res, COOKIE_NAMES.TWO_FACTOR);

  return res.status(200).json({
    success: true,
    message: "Logged in successfully.",
    role: role,
  });
}

export async function checkEmailAvailability(req, res) {
  const { email } = req.body;

  if (await isEmailTaken(email)) {
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

  if (await isUsernameTaken(username)) {
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

  const currentUser = await getPasswordByEmail(email);
  if (!currentUser) {
    return res.status(404).json({ success: false, message: "User not found." });
  }

  const existingPassword = currentUser.password;
  if (existingPassword) {
    const isSamePassword = await bcrypt.compare(password, existingPassword);
    if (isSamePassword) {
      return res.status(400).json({
        success: false,
        message: "New password cannot be the same as the old password.",
      });
    }
  }

  const saltRounds = Number(process.env.SALT_ROUNDS || 10);
  const hashedPassword = await bcrypt.hash(password, saltRounds);

  await updatePasswordByEmail(email, hashedPassword);

  clearCookie(res, COOKIE_NAMES.PASSWORD_RESET);

  return res.status(200).json({
    success: true,
    message: "Password reset successful.",
  });
}

export async function completeGoogleSignup(req, res) {
  const { username } = req.body;
  const { email, name, avatar } = req.user;

  if (await isUsernameTaken(username)) {
    return res.status(400).json({
      success: false,
      message: "This username is already taken.",
    });
  }

  const randomPassword = crypto.randomBytes(32).toString("hex");
  const hashedPassword = await bcrypt.hash(
    randomPassword,
    Number(process.env.SALT_ROUNDS || 10),
  );

  const { id, role } = await createGoogleUser({
    email,
    name,
    username,
    avatarUrl: avatar,
    password: hashedPassword,
    authProvider: "google",
  });
  const payload = {
    type: "access",
    user: {
      userId: id,
      role,
    },
  };

  const token = generateToken(payload, "7d");
  setCookie(res, COOKIE_NAMES.ACCESS, token, 7 * 24 * 60 * 60 * 1000);

  await sendLoginNotificationEmail({
    to: email,
    name,
    ipAddress: req.ip,
    userAgent: req.get("user-agent"),
  });

  clearCookie(res, COOKIE_NAMES.OAUTH);

  return res.status(200).json({ success: true, redirectTo: "/user/dashboard" });
}

export async function googleOAuthCallback(req, res) {
  if (!process.env.GOOGLE_CLIENT_ID) {
    return res.status(401).json({
      success: false,
      message: "Google sign-in could not be verified. Please try again.",
    });
  }

  let googleProfile;
  try {
    const ticket = await googleAuthClient.verifyIdToken({
      idToken: req.validated.body.credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    googleProfile = ticket.getPayload();
  } catch {
    return res.status(401).json({
      success: false,
      message: "Google sign-in could not be verified. Please try again.",
    });
  }

  if (
    !googleProfile?.email ||
    googleProfile.email_verified !== true
  ) {
    return res.status(401).json({
      success: false,
      message: "Google sign-in could not be verified. Please try again.",
    });
  }

  const user = await findUserForGoogleLogin(googleProfile.email);

  if (user) {
    const token = generateToken(
      { type: "access", user: { userId: user.id, role: user.role } },
      "7d",
    );
    setCookie(res, COOKIE_NAMES.ACCESS, token, 7 * 24 * 60 * 60 * 1000);

    await sendLoginNotificationEmail({
      to: user.email,
      name: user.name,
      ipAddress: req.ip,
      userAgent: req.get("user-agent"),
    });

    const dashboardPath =
      user.role === "admin" ? "/admin/dashboard" : "/user/dashboard";
    return res.json({ success: true, redirectTo: dashboardPath });
  }

  const name = googleProfile.name || googleProfile.email.split("@")[0];
  const avatar = googleProfile.picture || null;
  const payload = {
    type: "oauth",
    user: {
      email: googleProfile.email,
      name,
      avatar,
      completed: false,
    },
  };

  const token = generateToken(payload, "5min");
  setCookie(res, COOKIE_NAMES.OAUTH, token, 5 * 60 * 1000);

  return res.json({ success: true, redirectTo: "/complete-profile" });
}
