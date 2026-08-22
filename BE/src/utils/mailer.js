const nodemailer = require('nodemailer');

let transporter = null;

function getTransporter() {
  if (transporter) return transporter;
  if (!process.env.EMAIL_USER || !process.env.EMAIL_APP_PASSWORD) return null;

  transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_APP_PASSWORD,
    },
  });
  return transporter;
}

async function sendMail({ to, subject, html }) {
  const list = (Array.isArray(to) ? to : [to]).filter((email) => email && email.trim());
  if (list.length === 0) return;

  const t = getTransporter();
  if (!t) {
    console.warn('Chưa cấu hình EMAIL_USER / EMAIL_APP_PASSWORD, bỏ qua gửi email.');
    return;
  }

  try {
    await t.sendMail({
      from: `"Ngô Như Cake Studio" <${process.env.EMAIL_USER}>`,
      to: list.join(','),
      subject,
      html,
    });
  } catch (err) {
    console.error('Gửi email thất bại:', err.message);
  }
}

module.exports = { sendMail };
