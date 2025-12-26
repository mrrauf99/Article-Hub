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
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,

  handler: (req, res) => {
    const retryAfterSeconds = getRetryAfterSeconds(req);

    res.status(429).json({
      success: false,
      type: "LOGIN_LIMIT",
      message: "Too many login attempts.  Please try again later.",
      retryAfterSeconds,
    });
  },
});

/* ===================== OTP RESEND ===================== */

export const otpResendLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 3,

  handler: (req, res) => {
    const retryAfterSeconds = getRetryAfterSeconds(req);

    res.status(429).json({
      success: false,
      type: "OTP_RESEND_LIMIT",
      message: "OTP resend limit reached. Please wait before trying again.",
      retryAfterSeconds,
    });
  },
});

/* ===================== OTP VERIFY ===================== */

export const otpVerifyLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 5,

  handler: (req, res) => {
    res.status(429).json({
      success: false,
      type: "OTP_VERIFY_LIMIT",
      message:
        "Too many incorrect OTP attempts. Please request a new verification code.",
    });
  },
});
