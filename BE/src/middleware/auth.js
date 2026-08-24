const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const { signToken, setAuthCookie } = require('../utils/authCookie');

async function protect(req, res, next) {
  const token = req.cookies?.token;

  if (!token) {
    return res.status(401).json({ message: 'Chưa đăng nhập' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const admin = await Admin.findById(decoded.id).select('name username email phone role');

    if (!admin) {
      return res.status(401).json({ message: 'Tài khoản không tồn tại' });
    }

    req.admin = admin;
    // Duy trì đăng nhập: mỗi request hợp lệ sẽ cấp lại cookie mới, dời hạn 30 ngày
    // tính từ lần hoạt động gần nhất, thay vì hết hạn cứng 30 ngày kể từ lúc đăng nhập.
    setAuthCookie(res, signToken(admin));
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Phiên đăng nhập không hợp lệ' });
  }
}

module.exports = protect;
