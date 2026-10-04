import { verifyToken } from "../utils/jwt.js";

export const authenticate = (cookieName) => (req, res, next) => {
  try {
    const token = req.cookies?.[cookieName];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Authentication required.",
      });
    }

    const decoded = verifyToken(token);
    req.user = decoded.user;
    req.auth = decoded.auth;
    req.type = decoded.type;
    next();
  } catch {
    return res.status(401).json({
      success: false,
      message: "Your session has expired. Please sign in again.",
    });
  }
};

export const optionalAuthenticate = (cookieName) => (req, res, next) => {
  try {
    const token = req.cookies?.[cookieName];

    if (token) {
      const decoded = verifyToken(token);
      req.user = decoded.user;
      req.auth = decoded.auth;
      req.type = decoded.type;
    }
  } catch {
    // Ignore invalid/expired token for optional authentication
  }

  next();
};
