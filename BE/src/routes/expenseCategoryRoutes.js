const express = require('express');
const {
  getExpenseCategories,
  createExpenseCategory,
  updateExpenseCategory,
  deleteExpenseCategory,
} = require('../controllers/expenseCategoryController');
const protect = require('../middleware/auth');
const requireRole = require('../middleware/requireRole');

const router = express.Router();

router.get('/', protect, getExpenseCategories);
router.post('/', protect, requireRole('owner'), createExpenseCategory);
router.put('/:id', protect, requireRole('owner'), updateExpenseCategory);
router.delete('/:id', protect, requireRole('owner'), deleteExpenseCategory);

module.exports = router;
