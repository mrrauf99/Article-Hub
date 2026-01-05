const ALLOWED_FLOWS = ["signup", "reset-password"];

export function requireOtpSession(req, res, next) {
  const otp = req.session.otp;

  if (!otp || !ALLOWED_FLOWS.includes(otp.flow)) {
    return res.status(403).json({
      success: false,
      message:
        "Your verification session has expired. Please request a new code.",
    });
  }

  next();
}
