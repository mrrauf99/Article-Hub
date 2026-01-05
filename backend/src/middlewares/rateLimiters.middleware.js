import rateLimit from "express-rate-limit";

function getRetryAfterSeconds(req) {
  return Math.max(
    0,
    Math.ceil((req.rateLimit.resetTime.getTime() - Date.now()) / 1000)
  );
}

export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      type: "LOGIN_LIMIT",
      message: "Too many login attempts. Please try again later.",
      retryAfterSeconds: getRetryAfterSeconds(req),
    });
  },
});
