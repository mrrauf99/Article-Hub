export function requireOAuthSession(req, res, next) {
  if (!req.session.oauth || req.session.oauth.completed) {
    return res.status(403).json({
      success: false,
      message: "OAuth session expired.",
    });
  }

  next();
}
