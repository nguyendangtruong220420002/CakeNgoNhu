const mongoose = require('mongoose');
const ExpenseCategory = require('../models/ExpenseCategory');
const asyncHandler = require('../middleware/asyncHandler');

const DEFAULT_CATEGORIES = [
  'Nguyên vật liệu',
  'Bao bì',
  'Nhân công',
  'Mặt bằng',
  'Marketing',
  'Vận chuyển',
  'Khác',
];

function isValidId(id) {
  return mongoose.Types.ObjectId.isValid(id);
}

const getExpenseCategories = asyncHandler(async function (req, res) {
  const count = await ExpenseCategory.countDocuments();
  if (count === 0) {
    await ExpenseCategory.insertMany(
      DEFAULT_CATEGORIES.map((name) => ({ name, isDefault: true }))
    );
  }

  const categories = await ExpenseCategory.find().sort({ isDefault: -1, name: 1 });
  res.json(categories);
});

const createExpenseCategory = asyncHandler(async function (req, res) {
  const { name } = req.body;
  if (!name || !name.trim()) {
    return res.status(400).json({ message: 'Vui lòng nhập tên mục chi tiêu' });
  }

  const category = await ExpenseCategory.create({ name: name.trim(), isDefault: false });
  res.status(201).json(category);
});

const updateExpenseCategory = asyncHandler(async function (req, res) {
  const { id } = req.params;
  const { name } = req.body;

  if (!isValidId(id)) {
    return res.status(400).json({ message: 'ID không hợp lệ' });
  }
  if (!name || !name.trim()) {
    return res.status(400).json({ message: 'Vui lòng nhập tên mục chi tiêu' });
  }

  const category = await ExpenseCategory.findByIdAndUpdate(
    id,
    { name: name.trim() },
    { new: true, runValidators: true }
  );

  if (!category) {
    return res.status(404).json({ message: 'Không tìm thấy mục chi tiêu' });
  }

  res.json(category);
});

const deleteExpenseCategory = asyncHandler(async function (req, res) {
  const { id } = req.params;
  if (!isValidId(id)) {
    return res.status(400).json({ message: 'ID không hợp lệ' });
  }

  const category = await ExpenseCategory.findById(id);
  if (!category) {
    return res.status(404).json({ message: 'Không tìm thấy mục chi tiêu' });
  }
  if (category.isDefault) {
    return res.status(400).json({ message: 'Không thể xoá mục chi tiêu mặc định' });
  }

  await category.deleteOne();
  res.status(204).send();
});

module.exports = {
  getExpenseCategories,
  createExpenseCategory,
  updateExpenseCategory,
  deleteExpenseCategory,
};
