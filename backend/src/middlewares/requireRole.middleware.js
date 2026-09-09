export function requireRole(allowedRole) {
  return (req, res, next) => {
    const { role } = req.user;

    if (role !== allowedRole) {
      return res.status(403).json({
        success: false,
        message: "You don't have permission to view this.",
      });
    }

    next();
  };
}
