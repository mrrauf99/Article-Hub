import cloudinary from "../config/cloudinary.config.js";

export const ARTICLE_IMAGE_OPTIONS = {
  folder: "article_hub/articles",
  resource_type: "image",
  transformation: [{ quality: "auto", fetch_format: "auto" }],
};

export const AVATAR_OPTIONS = {
  folder: "article_hub/avatars",
  transformation: [
    { width: 200, height: 200, crop: "fill", gravity: "face" },
    { quality: "auto", fetch_format: "auto" },
  ],
};

// Delete an image from Cloudinary using its public_id.

export async function deleteImageFromCloudinary(publicId) {
  if (!publicId) {
    return null;
  }

  return cloudinary.uploader.destroy(publicId, {
    resource_type: "image",
    invalidate: true,
  });
}

export const uploadImageToCloudinary = (buffer, options) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      options,
      (error, result) => {
        if (error) {
          reject(error);
        }
        resolve(result);
      },
    );

    uploadStream.end(buffer);
  });
};
