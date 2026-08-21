require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Admin = require('../models/Admin');

async function main() {
  const [name, username, password, role = 'owner', email, phone] = process.argv.slice(2);

  if (!name || !username || !password) {
    console.error(
      'Cách dùng: npm run seed:admin -- "<Tên>" <username> <mật khẩu> [owner|employee] [email] [số điện thoại]'
    );
    process.exit(1);
  }

  if (!['owner', 'employee'].includes(role)) {
    console.error('Role phải là "owner" hoặc "employee"');
    process.exit(1);
  }

  await mongoose.connect(process.env.MONGODB_URI);

  const existing = await Admin.findOne({
    $or: [
      { username: username.toLowerCase().trim() },
      ...(email ? [{ email: email.toLowerCase().trim() }] : []),
      ...(phone ? [{ phone: phone.trim() }] : []),
    ],
  });
  if (existing) {
    console.error('Admin với username/email/số điện thoại này đã tồn tại');
    await mongoose.disconnect();
    process.exit(1);
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const admin = await Admin.create({
    name,
    username: username.toLowerCase().trim(),
    email: email ? email.toLowerCase().trim() : undefined,
    phone: phone ? phone.trim() : undefined,
    passwordHash,
    role,
  });

  console.log(`Đã tạo admin: ${admin.username} (${admin.role})`);
  await mongoose.disconnect();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
