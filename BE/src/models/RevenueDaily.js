const mongoose = require('mongoose');

const revenueDailySchema = new mongoose.Schema({
  date: { type: Date, required: true },
  totalRevenue: { type: Number, required: true, default: 0 },
  orderCount: { type: Number, required: true, default: 0 },
  source: { type: String, enum: ['auto', 'manual'], default: 'auto' },
});

module.exports = mongoose.model('RevenueDaily', revenueDailySchema);
