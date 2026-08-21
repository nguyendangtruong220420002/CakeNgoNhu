const express = require('express');
const { getExpenses, createExpense, deleteExpense } = require('../controllers/expenseController');
const protect = require('../middleware/auth');
const requireRole = require('../middleware/requireRole');

const router = express.Router();

router.get('/', protect, requireRole('owner'), getExpenses);
router.post('/', protect, createExpense);
router.delete('/:id', protect, requireRole('owner'), deleteExpense);

module.exports = router;
