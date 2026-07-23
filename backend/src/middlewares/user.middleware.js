import db from "../config/db.config.js";

export async function requireUser(req, res, next) {
  const userId = req.user.userId;

  const { rows } = await db.query("SELECT role FROM users WHERE id = $1", [
    userId,
  ]);

  if (rows[0]?.role !== "user") {
    return res.status(403).json({
      success: false,
      message: "User access required",
    });
  }

  next();
}
