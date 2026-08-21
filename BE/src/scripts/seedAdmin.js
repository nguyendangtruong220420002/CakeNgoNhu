require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Admin = require('../models/Admin');

async function main() {
  const [name, email, password, role = 'owner'] = process.argv.slice(2);

  if (!name || !email || !password) {
    console.error(
      'Cách dùng: npm run seed:admin -- "<Tên>" <email> <mật khẩu> [owner|employee]'
    );
    process.exit(1);
  }

  if (!['owner', 'employee'].includes(role)) {
    console.error('Role phải là "owner" hoặc "employee"');
    process.exit(1);
  }

  await mongoose.connect(process.env.MONGODB_URI);

  const existing = await Admin.findOne({ email: email.toLowerCase().trim() });
  if (existing) {
    console.error(`Admin với email ${email} đã tồn tại`);
    await mongoose.disconnect();
    process.exit(1);
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const admin = await Admin.create({
    name,
    email: email.toLowerCase().trim(),
    passwordHash,
    role,
  });

  console.log(`Đã tạo admin: ${admin.email} (${admin.role})`);
  await mongoose.disconnect();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
