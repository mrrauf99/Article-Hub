import db from "../config/db.config.js";

export async function requireAdmin(req, res, next) {
  const userId = req.session.userId;

  const { rows } = await db.query("SELECT role FROM users WHERE id = $1", [
    userId,
  ]);

  if (rows[0]?.role !== "admin") {
    return res.status(403).json({
      success: false,
      message: "Admin access required",
    });
  }

  next();
}
