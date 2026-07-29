import multer from "multer";

const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
const storage = multer.memoryStorage();

const filter = (req, file, cb) => {
  if (!ALLOWED_IMAGE_TYPES.includes(file.mimetype)) {
    return cb(new Error("Only JPEG, PNG, and WebP images are allowed."));
  }
  cb(null, true);
};

export const uploadImage = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: filter,
});
