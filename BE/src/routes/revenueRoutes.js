const express = require('express');
const {
  getDailyRevenue,
  getManualRevenueEntries,
  createManualRevenue,
  updateManualRevenue,
  deleteManualRevenue,
} = require('../controllers/revenueController');
const protect = require('../middleware/auth');
const requireRole = require('../middleware/requireRole');

const router = express.Router();

router.get('/daily', protect, requireRole('owner'), getDailyRevenue);
router.post('/daily', protect, requireRole('owner'), createManualRevenue);
router.get('/manual', protect, requireRole('owner'), getManualRevenueEntries);
router.put('/manual/:id', protect, requireRole('owner'), updateManualRevenue);
router.delete('/manual/:id', protect, requireRole('owner'), deleteManualRevenue);

module.exports = router;
