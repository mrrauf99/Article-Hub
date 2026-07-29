import db from "../config/db.config.js";
import bcrypt from "bcrypt";
import speakeasy from "speakeasy";
import qrcode from "qrcode";

import {
  deleteImageFromCloudinary,
  uploadImageToCloudinary,
  AVATAR_OPTIONS,
} from "../services/cloudinary.service.js";
import { validateProfileData } from "../utils/validation.utils.js";

import { PASSWORD_MAX, PASSWORD_MIN } from "../utils/validation.utils.js";

export async function getProfile(req, res) {
  const { userId } = req.user;

  const { rows } = await db.query(
    `
      SELECT id, username, name, email, expertise, avatar_url,  
      joined_at, bio, portfolio_url, x_url, linkedin_url, 
      instagram_url, facebook_url, role, gender, country, two_factor_enabled
      FROM users WHERE id = $1
      `,
    [userId],
  );

  return res.json({
    success: true,
    message: "User profile retrieved successfully.",
    data: rows[0],
  });
}

export async function getUserStats(req, res) {
  const { userId } = req.user;

  const { rows } = await db.query(
    `
      SELECT COUNT(id)::int AS articles,
      COALESCE(SUM(views), 0)::int AS views
      FROM articles WHERE author_id = $1
    `,
    [userId],
  );

  return res.json({
    success: true,
    data: rows[0],
  });
}

export async function updateUserProfile(req, res) {
  const { userId } = req.user;

  const {
    name,
    expertise,
    bio,
    portfolio_url,
    x_url,
    linkedin_url,
    facebook_url,
    instagram_url,
    gender,
    country,
  } = req.body;

  // Validate profile data
  const validationErrors = validateProfileData({
    name,
    expertise,
    bio,
    portfolio_url,
    x_url,
    linkedin_url,
    facebook_url,
    instagram_url,
    gender,
    country,
  });

  if (validationErrors.length > 0) {
    return res.status(422).json({
      success: false,
      message: validationErrors.join(", "),
    });
  }

  // Upload the new avatar, if provided
  let avatarUrl;
  let avatarPublicId;

  if (req.file) {
    // First, get the current avatar_public_id to delete it later
    const currentUserQuery = await db.query(
      "SELECT avatar_public_id FROM users WHERE id = $1",
      [userId],
    );
    const oldAvatarPublicId = currentUserQuery.rows[0].avatar_public_id;

    // Upload new avatar to Cloudinary
    const uploadedAvatar = await uploadImageToCloudinary(
      req.file.buffer,
      AVATAR_OPTIONS,
    );

    avatarUrl = uploadedAvatar.secure_url;
    avatarPublicId = uploadedAvatar.public_id;

    // Delete old avatar from Cloudinary if it exist
    if (oldAvatarPublicId) {
      try {
        await deleteImageFromCloudinary(oldAvatarPublicId);
      } catch (deleteErr) {
        // Log error but don't fail the request if deletion fails
        console.error(
          "Failed to delete old avatar from Cloudinary:",
          deleteErr,
        );
      }
    }
  }

  const fields = [
    "name = $1",
    "expertise = $2",
    "bio = $3",
    "portfolio_url = $4",
    "x_url = $5",
    "linkedin_url = $6",
    "facebook_url = $7",
    "instagram_url = $8",
    "gender = $9",
    "country = $10",
  ];

  const values = [
    name,
    expertise,
    bio,
    portfolio_url,
    x_url,
    linkedin_url,
    facebook_url,
    instagram_url,
    gender,
    country,
  ];

  if (avatarUrl) {
    fields.push(`avatar_url = $${values.length + 1}`);
    values.push(avatarUrl);

    fields.push(`avatar_public_id = $${values.length + 1}`);
    values.push(avatarPublicId);
  }

  values.push(userId);

  const query = `
  UPDATE users
  SET ${fields.join(",\n      ")}
  WHERE id = $${values.length}
  RETURNING id, name, expertise, bio, avatar_url, portfolio_url, x_url,
            linkedin_url, facebook_url, instagram_url, gender, country;
`;

  const { rows: updated } = await db.query(query, values);

  return res.json({
    success: true,
    message: "Profile updated successfully.",
    data: updated[0],
  });
}

export async function changePassword(req, res) {
  const { userId } = req.user;
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return res.status(400).json({
      success: false,
      message: "Current and new password are required.",
    });
  }

  if (newPassword.length < PASSWORD_MIN || newPassword.length > PASSWORD_MAX) {
    return res.status(400).json({
      success: false,
      message: "Password must be between 8 and 64 characters.",
    });
  }

  const { rows } = await db.query("SELECT password FROM users WHERE id = $1", [
    userId,
  ]);

  const existingPassword = rows[0].password;

  const isMatch = await bcrypt.compare(currentPassword, existingPassword);
  if (!isMatch) {
    return res.status(401).json({
      success: false,
      message: "Current password is incorrect.",
    });
  }

  const isSamePassword = await bcrypt.compare(newPassword, existingPassword);
  if (isSamePassword) {
    return res.status(400).json({
      success: false,
      message: "New password cannot be the same as the current password.",
    });
  }

  const saltRounds = Number(process.env.SALT_ROUNDS);
  const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

  await db.query("UPDATE users SET password = $1 WHERE id = $2", [
    hashedPassword,
    userId,
  ]);

  return res.status(200).json({
    success: true,
    message: "Password updated successfully.",
  });
}

export async function startTwoFactorSetup(req, res) {
  const { userId } = req.user;
  const { password } = req.body;

  if (!password) {
    return res.status(400).json({
      success: false,
      message: "Password is required to enable 2FA.",
    });
  }

  const { rows } = await db.query(
    "SELECT email, password, two_factor_enabled FROM users WHERE id = $1",
    [userId],
  );

  if (rows[0].two_factor_enabled) {
    return res.status(400).json({
      success: false,
      message: "Two-factor authentication is already enabled.",
    });
  }

  const isMatch = await bcrypt.compare(password, rows[0].password);
  if (!isMatch) {
    return res.status(401).json({
      success: false,
      message: "Password is incorrect.",
    });
  }

  const secret = speakeasy.generateSecret({
    name: "Article Hub",
  });

  const qrCodeDataUrl = await qrcode.toDataURL(secret.otpauth_url);

  await db.query("UPDATE users SET two_factor_secret = $1 WHERE id = $2", [
    secret.base32,
    userId,
  ]);

  return res.status(200).json({
    success: true,
    qrCodeDataUrl,
    secret: secret.base32,
  });
}

export async function verifyTwoFactorSetup(req, res) {
  const { userId } = req.user;
  const { code } = req.body;

  const { rows } = await db.query(
    "SELECT two_factor_secret FROM users WHERE id = $1",
    [userId],
  );

  const secret = rows[0].two_factor_secret;

  if (!secret) {
    return res.status(400).json({
      success: false,
      message: "2FA setup session expired. Please try again.",
    });
  }

  if (!code) {
    return res.status(400).json({
      success: false,
      message: "Authentication code is required.",
    });
  }

  const isValid = speakeasy.totp.verify({
    secret: secret,
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

  await db.query("UPDATE users SET two_factor_enabled = TRUE WHERE id = $1", [
    userId,
  ]);

  return res.status(200).json({
    success: true,
    message: "Two-factor authentication enabled.",
  });
}

export async function disableTwoFactor(req, res) {
  const { userId } = req.user;
  const { password, code } = req.body;

  if (!password || !code) {
    return res.status(400).json({
      success: false,
      message: "Password and authentication code are required.",
    });
  }

  const { rows } = await db.query(
    "SELECT password, two_factor_enabled, two_factor_secret FROM users WHERE id = $1",
    [userId],
  );

  const user = rows[0];
  if (!user.two_factor_enabled || !user.two_factor_secret) {
    return res.status(400).json({
      success: false,
      message: "Two-factor authentication is not enabled.",
    });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(401).json({
      success: false,
      message: "Password is incorrect.",
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

  await db.query(
    "UPDATE users SET two_factor_enabled = FALSE, two_factor_secret = NULL WHERE id = $1",
    [userId],
  );

  return res.status(200).json({
    success: true,
    message: "Two-factor authentication disabled.",
  });
}
