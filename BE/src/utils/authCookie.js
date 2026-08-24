const jwt = require('jsonwebtoken');

const COOKIE_NAME = 'token';
const COOKIE_MAX_AGE = 30 * 24 * 60 * 60 * 1000; // 30 ngày — duy trì đăng nhập lâu, không bắt đăng nhập lại thường xuyên

function signToken(admin) {
  return jwt.sign({ id: admin._id, role: admin.role }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
}

function setAuthCookie(res, token) {
  const isProd = process.env.NODE_ENV === 'production';
  res.cookie(COOKIE_NAME, token, {
    httpOnly: true,
    // FE (vercel.app) và BE nằm khác domain nên cookie phải là cross-site:
    // 'none' bắt buộc đi kèm secure:true (browser chặn nếu không có https).
    sameSite: isProd ? 'none' : 'lax',
    secure: isProd,
    maxAge: COOKIE_MAX_AGE,
  });
}

function clearAuthCookie(res) {
  const isProd = process.env.NODE_ENV === 'production';
  res.clearCookie(COOKIE_NAME, {
    httpOnly: true,
    sameSite: isProd ? 'none' : 'lax',
    secure: isProd,
  });
}

module.exports = { COOKIE_NAME, signToken, setAuthCookie, clearAuthCookie };
