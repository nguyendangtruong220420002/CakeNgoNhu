const Order = require('../models/Order');
const RevenueDaily = require('../models/RevenueDaily');
const asyncHandler = require('../middleware/asyncHandler');

function toDateKey(date) {
  return new Date(date).toISOString().slice(0, 10);
}

function defaultRange() {
  const to = new Date();
  const from = new Date();
  from.setDate(from.getDate() - 29);
  return { from, to };
}

const getDailyRevenue = asyncHandler(async function (req, res) {
  const { from, to } = req.query;
  const range = from && to ? { from: new Date(from), to: new Date(to) } : defaultRange();

  const orders = await Order.find({
    status: { $ne: 'cancelled' },
    createdAt: { $gte: range.from, $lte: range.to },
  }).select('totalAmount createdAt');

  const manualEntries = await RevenueDaily.find({
    date: { $gte: range.from, $lte: range.to },
  });

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

const createManualRevenue = asyncHandler(async function (req, res) {
  const { date, totalRevenue, orderCount } = req.body;

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
    source: 'manual',
  });

  res.status(201).json(entry);
});

module.exports = { getDailyRevenue, createManualRevenue };
