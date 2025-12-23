import rateLimit from "express-rate-limit";

export const otpLimiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 5,
  message: "Too many attempts. Try again later.",
});
