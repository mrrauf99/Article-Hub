const CLOUDINARY_UPLOAD_SEGMENT = "/upload/";

export function buildCloudinarySrcSet(url, widths) {
  if (!url?.includes("res.cloudinary.com")) return undefined;

  const uploadIndex = url.indexOf(CLOUDINARY_UPLOAD_SEGMENT);
  if (uploadIndex === -1) return undefined;

  const transformSegment = url
    .slice(uploadIndex + CLOUDINARY_UPLOAD_SEGMENT.length)
    .split("/")[0];
  if (transformSegment.split(",").some((part) => part.startsWith("w_"))) {
    return undefined;
  }

  return widths
    .map((width) => optimizeCloudinaryUrl(url, { width }) + " " + width + "w")
    .join(", ");
}

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
  if (/\b(f_auto|q_auto)\b/.test(existingSegment)) {
    const hasWidth = existingSegment
      .split(",")
      .some((part) => part.startsWith("w_"));
    if (!width || hasWidth) return url;

    return (
      url.slice(0, splitAt) +
      existingSegment +
      ",w_" +
      width +
      "/" +
      url.slice(splitAt + existingSegment.length + 1)
    );
  }

  const transforms = ["f_auto", "q_auto"];
  if (width) transforms.push(`w_${width}`);

  return `${url.slice(0, splitAt)}${transforms.join(",")}/${url.slice(splitAt)}`;
}
