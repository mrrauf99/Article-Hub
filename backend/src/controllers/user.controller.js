import bcrypt from "bcrypt";
import speakeasy from "speakeasy";
import qrcode from "qrcode";

import {
  deleteImageFromCloudinary,
  uploadImageToCloudinary,
  AVATAR_OPTIONS,
} from "../services/cloudinary.service.js";
import {
  getAvatarPublicId,
  getPasswordById,
  getProfile as findProfile,
  getTwoFactorDisableUser,
  getTwoFactorSecret,
  getTwoFactorSetupUser,
  getUserStats as findUserStats,
  getUserSummary as findUserSummary,
  setTwoFactorEnabled,
  setTwoFactorSecret,
  updatePasswordById,
  updateProfile as saveProfile,
} from "../services/user.service.js";

export async function getProfile(req, res) {
  const { userId } = req.user;
  const profile = await findProfile(userId);

  return res.json({
    success: true,
    message: "User profile retrieved successfully.",
    data: profile,
  });
}

export async function getUserSummary(req, res) {
  const { userId } = req.user;

  const summary = await findUserSummary(userId);

  return res.json({
    success: true,
    message: "User summary retrieved successfully.",
    data: summary,
  });
}
export async function getUserStats(req, res) {
  const { userId } = req.user;

  const stats = await findUserStats(userId);

  return res.json({
    success: true,
    data: stats,
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

  let avatarUrl;
  let avatarPublicId;
  let oldAvatarPublicId;
  let uploadedAvatar;

  if (req.file) {
    oldAvatarPublicId = await getAvatarPublicId(userId);
    uploadedAvatar = await uploadImageToCloudinary(
      req.file.buffer,
      AVATAR_OPTIONS,
    );

    avatarUrl = uploadedAvatar.secure_url;
    avatarPublicId = uploadedAvatar.public_id;
  }

  let updated;
  try {
    updated = await saveProfile(userId, {
      name,
      expertise,
      bio,
      portfolioUrl: portfolio_url,
      xUrl: x_url,
      linkedinUrl: linkedin_url,
      facebookUrl: facebook_url,
      instagramUrl: instagram_url,
      gender,
      country,
      ...(avatarUrl ? { avatarUrl, avatarPublicId } : {}),
    });
  } catch (error) {
    if (uploadedAvatar) {
      try {
        await deleteImageFromCloudinary(uploadedAvatar.public_id);
      } catch (deleteError) {
        console.error("Failed to delete uploaded avatar from Cloudinary:", deleteError);
      }
    }
    throw error;
  }

  if (oldAvatarPublicId) {
    try {
      await deleteImageFromCloudinary(oldAvatarPublicId);
    } catch (deleteError) {
      console.error("Failed to delete old avatar from Cloudinary:", deleteError);
    }
  }

  return res.json({
    success: true,
    message: "Profile updated successfully.",
    data: updated,
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

  const currentUser = await getPasswordById(userId);
  if (!currentUser) {
    return res.status(404).json({ success: false, message: "User not found." });
  }

  const existingPassword = currentUser.password;

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

  const saltRounds = Number(process.env.SALT_ROUNDS || 10);
  const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

  await updatePasswordById(userId, hashedPassword);

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

  const user = await getTwoFactorSetupUser(userId);

  if (!user) {
    return res.status(401).json({ success: false, message: "Your session has expired. Please sign in again." });
  }

  if (user.twoFactorEnabled) {
    return res.status(400).json({
      success: false,
      message: "Two-factor authentication is already enabled.",
    });
  }

  const isMatch = await bcrypt.compare(password, user.password);
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

  await setTwoFactorSecret(userId, secret.base32);

  return res.status(200).json({
    success: true,
    qrCodeDataUrl,
    secret: secret.base32,
  });
}

export async function verifyTwoFactorSetup(req, res) {
  const { userId } = req.user;
  const { code } = req.body;

  const secret = await getTwoFactorSecret(userId);

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

  await setTwoFactorEnabled(userId, true);

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

  const user = await getTwoFactorDisableUser(userId);
  if (!user || !user.twoFactorEnabled || !user.twoFactorSecret) {
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
    secret: user.twoFactorSecret,
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

  await setTwoFactorEnabled(userId, false);

  return res.status(200).json({
    success: true,
    message: "Two-factor authentication disabled.",
  });
}
