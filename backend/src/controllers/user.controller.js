import db from "../config/db.config.js";
import cloudinary from "../config/cloudinary.config.js";
import bcrypt from "bcrypt";
import speakeasy from "speakeasy";
import qrcode from "qrcode";
import { deleteImageByUrl } from "../utils/cloudinary.utils.js";
import { validateProfileData } from "../utils/validation.utils.js";

const PASSWORD_MIN = 8;
const PASSWORD_MAX = 64;

export async function getProfile(req, res) {
  try {
    const userId = req.session.userId;

    const { rows } = await db.query(
      `
      SELECT id, username, name, email, expertise, avatar_url,  
      joined_at, bio, portfolio_url, x_url, linkedin_url, 
      instagram_url, facebook_url, role, gender, country, two_factor_enabled
      FROM users WHERE id = $1
      `,
      [userId],
    );

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User account not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "User profile retrieved successfully.",
      data: rows[0],
    });
  } catch (error) {
    console.error("User Profile retrieval failed:", error);

    // Check if error is due to missing column
    if (error.code === "42703") {
      return res.status(500).json({
        success: false,
        message: "Database column error. Please check users table schema.",
      });
    }

    return res.status(500).json({
      success: false,
      message: "An unexpected error occurred. Please try again later.",
    });
  }
}

export async function getUserStats(req, res) {
  try {
    const userId = req.session.userId;

    const { rows } = await db.query(
      `
      SELECT COUNT(article_id)::int AS articles,
      COALESCE(SUM(views), 0)::int AS views
      FROM articles WHERE author_id = $1
    `,
      [userId],
    );

    return res.status(200).json({
      success: true,
      data: rows[0],
    });
  } catch (error) {
    console.error("User stats error:", error);

    return res.status(500).json({
      success: false,
      message: "An unexpected error occurred. Please try again later.",
    });
  }
}

export async function updateUserProfile(req, res) {
  try {
    const userId = req.session.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

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
      return res.status(400).json({
        success: false,
        message: validationErrors.join(", "),
      });
    }

    // Handle avatar upload if file is provided
    let avatarUrl = null;
    if (req.file) {
      try {
        // First, get the current avatar URL to delete it later
        const currentUserQuery = await db.query(
          "SELECT avatar_url FROM users WHERE id = $1",
          [userId],
        );
        const currentAvatarUrl = currentUserQuery.rows[0]?.avatar_url;

        // Upload new avatar to Cloudinary
        const result = await new Promise((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            {
              folder: "article_hub/avatars",
              transformation: [
                { width: 200, height: 200, crop: "fill", gravity: "face" },
                { quality: "auto", fetch_format: "auto" },
              ],
            },
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            },
          );
          uploadStream.end(req.file.buffer);
        });

        avatarUrl = result.secure_url;

        // Delete old avatar from Cloudinary if it exists and is from Cloudinary
        if (currentAvatarUrl && currentAvatarUrl.includes("cloudinary.com")) {
          try {
            await deleteImageByUrl(currentAvatarUrl);
          } catch (deleteErr) {
            // Log error but don't fail the request if deletion fails
            console.error(
              "Failed to delete old avatar from Cloudinary:",
              deleteErr,
            );
          }
        }
      } catch (uploadErr) {
        console.error("Avatar upload error:", uploadErr);
        return res.status(500).json({
          success: false,
          message: "Failed to upload avatar image.",
        });
      }
    }

    // Build dynamic query based on whether avatar is being updated
    let query, params;

    if (avatarUrl) {
      query = `
        UPDATE users SET
          name = $1,
          expertise = $2,
          bio = $3,
          portfolio_url = $4,
          x_url = $5,
          linkedin_url = $6,
          facebook_url = $7,
          instagram_url = $8,
          gender = $9,
          country = $10,
          avatar_url = $11
        WHERE id = $12
        RETURNING id
      `;
      params = [
        name,
        expertise,
        bio,
        portfolio_url,
        x_url,
        linkedin_url,
        facebook_url,
        instagram_url,
        gender || null,
        country || null,
        avatarUrl,
        userId,
      ];
    } else {
      query = `
        UPDATE users SET
          name = $1,
          expertise = $2,
          bio = $3,
          portfolio_url = $4,
          x_url = $5,
          linkedin_url = $6,
          facebook_url = $7,
          instagram_url = $8,
          gender = $9,
          country = $10
        WHERE id = $11
        RETURNING id
      `;
      params = [
        name,
        expertise,
        bio,
        portfolio_url,
        x_url,
        linkedin_url,
        facebook_url,
        instagram_url,
        gender || null,
        country || null,
        userId,
      ];
    }

    const { rowCount } = await db.query(query, params);

    if (rowCount === 0) {
      return res
        .status(404)
        .json({ success: false, message: "User not found." });
    }

    return res.json({
      success: true,
      message: "Profile updated successfully.",
    });
  } catch (err) {
    console.error("updateUserProfile error:", err);

    // Check if error is due to missing column
    if (err.code === "42703") {
      return res.status(500).json({
        success: false,
        message: "Database column error. Please check users table schema.",
      });
    }

    return res.status(500).json({
      success: false,
      message: "An unexpected error occurred. Please try again later.",
    });
  }
}

export async function changePassword(req, res) {
  try {
    const userId = req.session.userId;
    const { currentPassword, newPassword, confirmPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Current and new password are required.",
      });
    }

    if (confirmPassword && confirmPassword !== newPassword) {
      return res.status(400).json({
        success: false,
        message: "New password and confirmation do not match.",
      });
    }

    if (
      newPassword.length < PASSWORD_MIN ||
      newPassword.length > PASSWORD_MAX
    ) {
      return res.status(400).json({
        success: false,
        message: "Password must be between 8 and 64 characters.",
      });
    }

    const { rows } = await db.query(
      "SELECT password FROM users WHERE id = $1",
      [userId],
    );

    if (!rows.length) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    const existingPassword = rows[0].password;
    if (!existingPassword) {
      return res.status(400).json({
        success: false,
        message: "Password reset is required for this account.",
      });
    }

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

    await db.query("UPDATE users SET password = $1 WHERE id = $2", [
      hashedPassword,
      userId,
    ]);

    return res.status(200).json({
      success: true,
      message: "Password updated successfully.",
    });
  } catch (err) {
    console.error("changePassword error:", err);
    return res.status(500).json({
      success: false,
      message: "Unable to change password. Please try again later.",
    });
  }
}

export async function startTwoFactorSetup(req, res) {
  try {
    const userId = req.session.userId;
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

    if (!rows.length) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    if (rows[0].two_factor_enabled) {
      return res.status(400).json({
        success: false,
        message: "Two-factor authentication is already enabled.",
      });
    }

    if (!rows[0].password) {
      return res.status(400).json({
        success: false,
        message: "Please set a password before enabling 2FA.",
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

    req.session.twoFactorSetup = {
      secret: secret.base32,
      createdAt: Date.now(),
    };

    const qrCodeDataUrl = await qrcode.toDataURL(secret.otpauth_url);

    return res.status(200).json({
      success: true,
      qrCodeDataUrl,
      secret: secret.base32,
    });
  } catch (err) {
    console.error("startTwoFactorSetup error:", err);
    return res.status(500).json({
      success: false,
      message: "Unable to start 2FA setup. Please try again.",
    });
  }
}

export async function verifyTwoFactorSetup(req, res) {
  try {
    const userId = req.session.userId;
    const { token } = req.body;
    const setup = req.session.twoFactorSetup;

    if (!setup?.secret) {
      return res.status(400).json({
        success: false,
        message: "2FA setup session expired. Please try again.",
      });
    }

    if (!token) {
      return res.status(400).json({
        success: false,
        message: "Authentication code is required.",
      });
    }

    const isValid = speakeasy.totp.verify({
      secret: setup.secret,
      encoding: "base32",
      token,
      window: 1,
    });

    if (!isValid) {
      return res.status(400).json({
        success: false,
        message: "Invalid authentication code.",
      });
    }

    await db.query(
      "UPDATE users SET two_factor_enabled = TRUE, two_factor_secret = $1 WHERE id = $2",
      [setup.secret, userId],
    );

    delete req.session.twoFactorSetup;

    return res.status(200).json({
      success: true,
      message: "Two-factor authentication enabled.",
    });
  } catch (err) {
    console.error("verifyTwoFactorSetup error:", err);
    return res.status(500).json({
      success: false,
      message: "Unable to enable 2FA. Please try again.",
    });
  }
}

export async function disableTwoFactor(req, res) {
  try {
    const userId = req.session.userId;
    const { password, token } = req.body;

    if (!password || !token) {
      return res.status(400).json({
        success: false,
        message: "Password and authentication code are required.",
      });
    }

    const { rows } = await db.query(
      "SELECT password, two_factor_enabled, two_factor_secret FROM users WHERE id = $1",
      [userId],
    );

    if (!rows.length) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    if (!rows[0].two_factor_enabled || !rows[0].two_factor_secret) {
      return res.status(400).json({
        success: false,
        message: "Two-factor authentication is not enabled.",
      });
    }

    if (!rows[0].password) {
      return res.status(400).json({
        success: false,
        message: "Please set a password before disabling 2FA.",
      });
    }

    const isMatch = await bcrypt.compare(password, rows[0].password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Password is incorrect.",
      });
    }

    const isValid = speakeasy.totp.verify({
      secret: rows[0].two_factor_secret,
      encoding: "base32",
      token,
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
  } catch (err) {
    console.error("disableTwoFactor error:", err);
    return res.status(500).json({
      success: false,
      message: "Unable to disable 2FA. Please try again.",
    });
  }
}
