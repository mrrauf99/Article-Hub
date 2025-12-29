import rateLimit from "express-rate-limit";

/* ===================== HELPERS ===================== */
function getRetryAfterSeconds(req) {
  return Math.max(
    0,
    Math.ceil((req.rateLimit.resetTime.getTime() - Date.now()) / 1000)
  );
}

/* ===================== LOGIN ===================== */
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

/* ===================== OTP RESEND ===================== */
// No rate limit on resend - users can request new OTP anytime
// The session-based OTP system handles security by invalidating old OTPs

/* ===================== OTP VERIFY ===================== */
// Rate limiting removed - attempts are tracked per OTP in session (5 attempts per OTP)
// This allows fresh 5 attempts after each resend
