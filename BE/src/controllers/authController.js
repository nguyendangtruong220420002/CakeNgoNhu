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
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Vui lòng nhập email và mật khẩu' });
  }

  const admin = await Admin.findOne({ email: email.toLowerCase().trim() });
  if (!admin) {
    return res.status(401).json({ message: 'Email hoặc mật khẩu không đúng' });
  }

  const isMatch = await bcrypt.compare(password, admin.passwordHash);
  if (!isMatch) {
    return res.status(401).json({ message: 'Email hoặc mật khẩu không đúng' });
  }

  const token = signToken(admin);
  setAuthCookie(res, token);

  res.json({ name: admin.name, email: admin.email, role: admin.role });
});

const logout = asyncHandler(async function (req, res) {
  res.clearCookie(COOKIE_NAME);
  res.status(204).send();
});

const me = asyncHandler(async function (req, res) {
  res.json({ name: req.admin.name, email: req.admin.email, role: req.admin.role });
});

module.exports = { login, logout, me };
