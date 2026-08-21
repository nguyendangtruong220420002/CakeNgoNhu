function requireRole(...roles) {
  return function (req, res, next) {
    if (!req.admin || !roles.includes(req.admin.role)) {
      return res.status(403).json({ message: 'Không có quyền truy cập' });
    }
    next();
  };
}

module.exports = requireRole;
