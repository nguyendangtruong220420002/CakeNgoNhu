const mongoose = require('mongoose');
const Order = require('../models/Order');
const RevenueDaily = require('../models/RevenueDaily');
const asyncHandler = require('../middleware/asyncHandler');
const { REVENUE_STATUSES } = require('../constants/orderStatus');

function toDateKey(date) {
  return new Date(date).toISOString().slice(0, 10);
}

function buildDateFilter(from, to) {
  if (!from && !to) return null;
  const filter = {};
  if (from) filter.$gte = new Date(from);
  if (to) {
    const toDate = new Date(to);
    toDate.setHours(23, 59, 59, 999);
    filter.$lte = toDate;
  }
  return filter;
}

const getDailyRevenue = asyncHandler(async function (req, res) {
  const { from, to } = req.query;
  const dateFilter = buildDateFilter(from, to);

  const orderFilter = { status: { $in: REVENUE_STATUSES }, countInRevenue: true };
  if (dateFilter) orderFilter.createdAt = dateFilter;

  const revenueFilter = {};
  if (dateFilter) revenueFilter.date = dateFilter;

  const orders = await Order.find(orderFilter).select('totalAmount createdAt');
  const manualEntries = await RevenueDaily.find(revenueFilter);

  const byDate = {};

  for (const order of orders) {
    const key = toDateKey(order.createdAt);
    if (!byDate[key]) {
      byDate[key] = { date: key, autoRevenue: 0, autoOrderCount: 0, manualRevenue: 0, manualOrderCount: 0 };
    }
    byDate[key].autoRevenue += order.totalAmount;
    byDate[key].autoOrderCount += 1;
  }

  for (const entry of manualEntries) {
    const key = toDateKey(entry.date);
    if (!byDate[key]) {
      byDate[key] = { date: key, autoRevenue: 0, autoOrderCount: 0, manualRevenue: 0, manualOrderCount: 0 };
    }
    byDate[key].manualRevenue += entry.totalRevenue;
    byDate[key].manualOrderCount += entry.orderCount;
  }

  const result = Object.values(byDate)
    .map((day) => ({
      ...day,
      totalRevenue: day.autoRevenue + day.manualRevenue,
      totalOrderCount: day.autoOrderCount + day.manualOrderCount,
    }))
    .sort((a, b) => (a.date < b.date ? 1 : -1));

  res.json(result);
});

const getManualRevenueEntries = asyncHandler(async function (req, res) {
  const { from, to } = req.query;
  const dateFilter = buildDateFilter(from, to);

  const filter = {};
  if (dateFilter) filter.date = dateFilter;

  const entries = await RevenueDaily.find(filter).sort({ date: -1 });
  res.json(entries);
});

const createManualRevenue = asyncHandler(async function (req, res) {
  const { date, totalRevenue, orderCount, note } = req.body;

  if (!date || Number.isNaN(new Date(date).getTime())) {
    return res.status(400).json({ message: 'Vui lòng chọn ngày' });
  }
  if (typeof totalRevenue !== 'number' || totalRevenue < 0) {
    return res.status(400).json({ message: 'Doanh thu không hợp lệ' });
  }
  if (!Number.isInteger(orderCount) || orderCount < 0) {
    return res.status(400).json({ message: 'Số đơn hàng không hợp lệ' });
  }

  const entry = await RevenueDaily.create({
    date,
    totalRevenue,
    orderCount,
    note: note ? note.trim() : '',
    source: 'manual',
  });

  res.status(201).json(entry);
});

const updateManualRevenue = asyncHandler(async function (req, res) {
  const { id } = req.params;
  const { date, totalRevenue, orderCount, note } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'ID không hợp lệ' });
  }
  if (!date || Number.isNaN(new Date(date).getTime())) {
    return res.status(400).json({ message: 'Vui lòng chọn ngày' });
  }
  if (typeof totalRevenue !== 'number' || totalRevenue < 0) {
    return res.status(400).json({ message: 'Doanh thu không hợp lệ' });
  }
  if (!Number.isInteger(orderCount) || orderCount < 0) {
    return res.status(400).json({ message: 'Số đơn hàng không hợp lệ' });
  }

  const entry = await RevenueDaily.findByIdAndUpdate(
    id,
    { date, totalRevenue, orderCount, note: note ? note.trim() : '' },
    { new: true, runValidators: true }
  );

  if (!entry) {
    return res.status(404).json({ message: 'Không tìm thấy khoản doanh thu' });
  }

  res.json(entry);
});

const deleteManualRevenue = asyncHandler(async function (req, res) {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'ID không hợp lệ' });
  }

  const entry = await RevenueDaily.findByIdAndDelete(id);
  if (!entry) {
    return res.status(404).json({ message: 'Không tìm thấy khoản doanh thu' });
  }

  res.status(204).send();
});

module.exports = {
  getDailyRevenue,
  getManualRevenueEntries,
  createManualRevenue,
  updateManualRevenue,
  deleteManualRevenue,
};
