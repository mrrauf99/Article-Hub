import cloudinary from "../config/cloudinary.config.js";

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
