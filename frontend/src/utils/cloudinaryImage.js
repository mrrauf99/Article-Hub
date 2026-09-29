const CLOUDINARY_UPLOAD_SEGMENT = "/upload/";

// Injects Cloudinary's automatic-format/automatic-quality delivery
// transform into an existing asset URL so images are served as
// modern formats at a sane compression level. No-op for anything
// that isn't a Cloudinary delivery URL, or one that's already
// transformed, so it's always safe to call on any image src.
export default function optimizeCloudinaryUrl(url, { width } = {}) {
  if (!url || !url.includes("res.cloudinary.com")) return url;

  const uploadIndex = url.indexOf(CLOUDINARY_UPLOAD_SEGMENT);
  if (uploadIndex === -1) return url;

  const splitAt = uploadIndex + CLOUDINARY_UPLOAD_SEGMENT.length;
  const existingSegment = url.slice(splitAt).split("/")[0];
  if (/\b(f_auto|q_auto)\b/.test(existingSegment)) return url;

  const transforms = ["f_auto", "q_auto"];
  if (width) transforms.push(`w_${width}`);

  return `${url.slice(0, splitAt)}${transforms.join(",")}/${url.slice(splitAt)}`;
}
