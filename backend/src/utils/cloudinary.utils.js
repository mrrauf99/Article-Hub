import cloudinary from "../config/cloudinary.config.js";

/**
 * Extract public_id from Cloudinary URL
 * @param {string} url - Cloudinary URL
 * @returns {string|null} - public_id or null if not a valid Cloudinary URL
 */
export function extractPublicIdFromUrl(url) {
  if (!url || typeof url !== "string" || !url.includes("cloudinary.com")) {
    return null;
  }

  try {
    // Cloudinary URL patterns:
    // https://res.cloudinary.com/{cloud_name}/{resource_type}/upload/{transformations}/v{version}/{public_id}.{format}
    // https://res.cloudinary.com/{cloud_name}/{resource_type}/upload/v{version}/{public_id}.{format}
    // https://res.cloudinary.com/{cloud_name}/{resource_type}/upload/{public_id}.{format}
    
    // Extract path after /upload/
    const uploadMatch = url.match(/\/upload\/(.+)/);
    if (!uploadMatch) {
      return null;
    }

    let pathAfterUpload = uploadMatch[1];
    
    // Remove transformations if present (they contain underscores and appear before version or public_id)
    // Look for version pattern /v{numbers}/
    const versionMatch = pathAfterUpload.match(/\/v\d+\/(.+)/);
    if (versionMatch) {
      pathAfterUpload = versionMatch[1];
    } else {
      // No version, check if there's a slash - if first part has underscores, it's likely transformations
      const firstSlashIndex = pathAfterUpload.indexOf("/");
      if (firstSlashIndex > 0) {
        const beforeSlash = pathAfterUpload.substring(0, firstSlashIndex);
        // Transformations typically contain underscores (e.g., w_200,h_200,c_fill)
        if (beforeSlash.includes("_") || beforeSlash.includes(",")) {
          pathAfterUpload = pathAfterUpload.substring(firstSlashIndex + 1);
        }
      }
    }
    
    // Remove file extension
    const lastDotIndex = pathAfterUpload.lastIndexOf(".");
    if (lastDotIndex !== -1) {
      pathAfterUpload = pathAfterUpload.substring(0, lastDotIndex);
    }
    
    // Return the public_id (which may include folder structure like "article_hub/articles/filename")
    return pathAfterUpload || null;
  } catch (error) {
    console.error("Error extracting public_id from URL:", error);
    return null;
  }
}

/**
 * Delete an image from Cloudinary by public_id
 * @param {string} publicId - The public_id of the image to delete
 * @returns {Promise<Object>} - Cloudinary deletion result
 */
export async function deleteImageFromCloudinary(publicId) {
  if (!publicId) {
    return { result: "not_found" };
  }

  try {
    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: "image",
      invalidate: true, // Invalidate CDN cache
    });
    return result;
  } catch (error) {
    console.error("Error deleting image from Cloudinary:", error);
    throw error;
  }
}

/**
 * Delete an image from Cloudinary by URL
 * @param {string} url - Cloudinary URL
 * @returns {Promise<Object>} - Cloudinary deletion result
 */
export async function deleteImageByUrl(url) {
  const publicId = extractPublicIdFromUrl(url);
  
  if (!publicId) {
    console.warn("Could not extract public_id from URL:", url);
    return { result: "not_found" };
  }

  return await deleteImageFromCloudinary(publicId);
}
