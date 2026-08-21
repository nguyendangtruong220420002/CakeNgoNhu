const mongoose = require('mongoose');
const Expense = require('../models/Expense');
const ExpenseCategory = require('../models/ExpenseCategory');
const asyncHandler = require('../middleware/asyncHandler');

function isValidId(id) {
  return mongoose.Types.ObjectId.isValid(id);
}

const getExpenses = asyncHandler(async function (req, res) {
  const { from, to, categoryId } = req.query;
  const filter = {};

  if (categoryId) filter.categoryId = categoryId;
  if (from || to) {
    filter.date = {};
    if (from) filter.date.$gte = new Date(from);
    if (to) filter.date.$lte = new Date(to);
  }

  const expenses = await Expense.find(filter)
    .sort({ date: -1 })
    .populate('categoryId', 'name');

  res.json(expenses);
});

const createExpense = asyncHandler(async function (req, res) {
  const { categoryId, date, amount, note } = req.body;

  if (!categoryId || !isValidId(categoryId)) {
    return res.status(400).json({ message: 'Vui lòng chọn mục chi tiêu' });
  }
  if (!date || Number.isNaN(new Date(date).getTime())) {
    return res.status(400).json({ message: 'Vui lòng chọn ngày chi' });
  }
  if (typeof amount !== 'number' || amount <= 0) {
    return res.status(400).json({ message: 'Số tiền không hợp lệ' });
  }

  const category = await ExpenseCategory.findById(categoryId);
  if (!category) {
    return res.status(404).json({ message: 'Không tìm thấy mục chi tiêu' });
  }

  const expense = await Expense.create({
    categoryId,
    date,
    amount,
    note: note || '',
    createdBy: req.admin.name,
  });

  const populated = await expense.populate('categoryId', 'name');
  res.status(201).json(populated);
});

const deleteExpense = asyncHandler(async function (req, res) {
  const { id } = req.params;
  if (!isValidId(id)) {
    return res.status(400).json({ message: 'ID không hợp lệ' });
  }

  const expense = await Expense.findByIdAndDelete(id);
  if (!expense) {
    return res.status(404).json({ message: 'Không tìm thấy khoản chi' });
  }

  res.status(204).send();
});

module.exports = { getExpenses, createExpense, deleteExpense };
