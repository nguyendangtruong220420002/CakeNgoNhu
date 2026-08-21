const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
  categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'ExpenseCategory', required: true },
  date: { type: Date, required: true },
  amount: { type: Number, required: true },
  note: { type: String, default: '' },
  createdBy: { type: String, required: true },
});

module.exports = mongoose.model('Expense', expenseSchema);
