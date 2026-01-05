import db from "../config/db.config.js";
import cloudinary from "../config/cloudinary.config.js";

export async function getProfile(req, res) {
  try {
    const userId = req.session.userId;

    const { rows } = await db.query(
      `
      SELECT username, name, email, expertise, avatar,  
      joined_at, bio, portfolio_link, x_link, linkedin_link, 
      instagram_link, facebook_link, role FROM users WHERE id = $1
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

    const {
      name,
      expertise,
      bio,
      portfolio_link,
      x_link,
      linkedin_link,
      facebook_link,
      instagram_link,
    } = req.body;

    // Handle avatar upload if file is provided
    let avatarUrl = null;
    if (req.file) {
      try {
        // Upload to Cloudinary
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
          portfolio_link = $4,
          x_link = $5,
          linkedin_link = $6,
          facebook_link = $7,
          instagram_link = $8,
          avatar = $9
        WHERE id = $10
        RETURNING id
      `;
      params = [
        name,
        expertise,
        bio,
        portfolio_link,
        x_link,
        linkedin_link,
        facebook_link,
        instagram_link,
        avatarUrl,
        userId,
      ];
    } else {
      query = `
        UPDATE users SET
          name = $1,
          expertise = $2,
          bio = $3,
          portfolio_link = $4,
          x_link = $5,
          linkedin_link = $6,
          facebook_link = $7,
          instagram_link = $8
        WHERE id = $9
        RETURNING id
      `;
      params = [
        name,
        expertise,
        bio,
        portfolio_link,
        x_link,
        linkedin_link,
        facebook_link,
        instagram_link,
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
    return res.status(500).json({
      success: false,
      message: "An unexpected error occurred. Please try again later.",
    });
  }
}
