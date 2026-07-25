import db from "../config/db.config.js";

export async function requireRole(allowedRole) {
  return async (req, res, next) => {
    const { userId } = req.user;

    const { rows } = await db.query("SELECT role FROM users WHERE id = $1", [
      userId,
    ]);

    if (rows[0]?.role !== allowedRole) {
      return res.status(403).json({
        success: false,
        message: `${allowedRole} access required.`,
      });
    }

    next();
  };
}
