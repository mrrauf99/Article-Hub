export function requireRole(allowedRole) {
  return (req, res, next) => {
    const { role } = req.user;

    if (role !== allowedRole) {
      return res.status(403).json({
        success: false,
        message: `${allowedRole} access required.`,
      });
    }

    next();
  };
}
