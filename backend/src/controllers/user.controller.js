import db from "../config/db.config.js";
import cloudinary from "../config/cloudinary.config.js";
import { deleteImageByUrl } from "../utils/cloudinary.utils.js";
import { validateProfileData } from "../utils/validation.utils.js";

export async function getProfile(req, res) {
  try {
    const userId = req.session.userId;

    const { rows } = await db.query(
      `
      SELECT username, name, email, expertise, avatar_url AS avatar,  
      joined_at, bio, portfolio_url, x_url, linkedin_url, 
      instagram_url, facebook_url, role, gender, country FROM users WHERE id = $1
      `,
      [userId]
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
    if (error.code === '42703') {
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
      [userId]
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
          [userId]
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
            }
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
            console.error("Failed to delete old avatar from Cloudinary:", deleteErr);
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
    if (err.code === '42703') {
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
