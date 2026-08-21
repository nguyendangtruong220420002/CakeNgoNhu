const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Admin = require('../models/Admin');
const asyncHandler = require('../middleware/asyncHandler');

const COOKIE_NAME = 'token';
const COOKIE_MAX_AGE = 7 * 24 * 60 * 60 * 1000; // 7 ngày

function signToken(admin) {
  return jwt.sign({ id: admin._id, role: admin.role }, process.env.JWT_SECRET, {
    expiresIn: '7d',
  });
}

function setAuthCookie(res, token) {
  res.cookie(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: COOKIE_MAX_AGE,
  });
}

const login = asyncHandler(async function (req, res) {
  const { identifier, password } = req.body;

  if (!identifier || !password) {
    return res.status(400).json({ message: 'Vui lòng nhập tên đăng nhập và mật khẩu' });
  }

  const value = identifier.trim();
  const admin = await Admin.findOne({
    $or: [{ username: value.toLowerCase() }, { email: value.toLowerCase() }, { phone: value }],
  });

  if (!admin) {
    return res.status(401).json({ message: 'Thông tin đăng nhập hoặc mật khẩu không đúng' });
  }

  const isMatch = await bcrypt.compare(password, admin.passwordHash);
  if (!isMatch) {
    return res.status(401).json({ message: 'Thông tin đăng nhập hoặc mật khẩu không đúng' });
  }

  const token = signToken(admin);
  setAuthCookie(res, token);

  res.json({
    name: admin.name,
    username: admin.username,
    email: admin.email,
    phone: admin.phone,
    role: admin.role,
  });
});

const logout = asyncHandler(async function (req, res) {
  res.clearCookie(COOKIE_NAME);
  res.status(204).send();
});

const me = asyncHandler(async function (req, res) {
  res.json({
    name: req.admin.name,
    username: req.admin.username,
    email: req.admin.email,
    phone: req.admin.phone,
    role: req.admin.role,
  });
});

module.exports = { login, logout, me };
