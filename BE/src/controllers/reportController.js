const Order = require('../models/Order');
const RevenueDaily = require('../models/RevenueDaily');
const Expense = require('../models/Expense');
const asyncHandler = require('../middleware/asyncHandler');
const { REVENUE_STATUSES } = require('../constants/orderStatus');

function toDateKey(date) {
  return new Date(date).toISOString().slice(0, 10);
}

const getProfitReport = asyncHandler(async function (req, res) {
  const { from, to } = req.query;

  const dateFilter = {};
  if (from) dateFilter.$gte = new Date(from);
  if (to) {
    const toDate = new Date(to);
    toDate.setHours(23, 59, 59, 999);
    dateFilter.$lte = toDate;
  }
  const hasDateFilter = Boolean(from || to);

  const orderFilter = { status: { $in: REVENUE_STATUSES }, countInRevenue: true };
  if (hasDateFilter) orderFilter.createdAt = dateFilter;

  const revenueFilter = {};
  if (hasDateFilter) revenueFilter.date = dateFilter;

  const expenseFilter = {};
  if (hasDateFilter) expenseFilter.date = dateFilter;

  const [orders, manualRevenue, expenses] = await Promise.all([
    Order.find(orderFilter).select('totalAmount createdAt'),
    RevenueDaily.find(revenueFilter),
    Expense.find(expenseFilter).select('amount date'),
  ]);

  const byDate = {};

  function ensureDay(key) {
    if (!byDate[key]) byDate[key] = { date: key, revenue: 0, expenses: 0 };
    return byDate[key];
  }

  for (const order of orders) {
    ensureDay(toDateKey(order.createdAt)).revenue += order.totalAmount;
  }
  for (const entry of manualRevenue) {
    ensureDay(toDateKey(entry.date)).revenue += entry.totalRevenue;
  }
  for (const expense of expenses) {
    ensureDay(toDateKey(expense.date)).expenses += expense.amount;
  }

  const days = Object.values(byDate)
    .map((day) => ({ ...day, profit: day.revenue - day.expenses }))
    .sort((a, b) => (a.date < b.date ? 1 : -1));

  const totals = days.reduce(
    (acc, day) => ({
      totalRevenue: acc.totalRevenue + day.revenue,
      totalExpenses: acc.totalExpenses + day.expenses,
      totalProfit: acc.totalProfit + day.profit,
    }),
    { totalRevenue: 0, totalExpenses: 0, totalProfit: 0 }
  );

  res.json({ days, totals });
});

const getDayDetail = asyncHandler(async function (req, res) {
  const { date } = req.query;

  if (!date || Number.isNaN(new Date(date).getTime())) {
    return res.status(400).json({ message: 'Ngày không hợp lệ' });
  }

  const dayStart = new Date(date);
  dayStart.setHours(0, 0, 0, 0);
  const dayEnd = new Date(date);
  dayEnd.setHours(23, 59, 59, 999);
  const range = { $gte: dayStart, $lte: dayEnd };

  const [orders, manualRevenue, expenses] = await Promise.all([
    Order.find({ status: { $in: REVENUE_STATUSES }, countInRevenue: true, createdAt: range })
      .select('totalAmount source items createdAt')
      .populate('customerId', 'name phone'),
    RevenueDaily.find({ date: range }),
    Expense.find({ date: range }).populate('categoryId', 'name'),
  ]);

  res.json({ orders, manualRevenue, expenses });
});

module.exports = { getProfitReport, getDayDetail };
