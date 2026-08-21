const express = require('express');
const { getDailyRevenue, createManualRevenue } = require('../controllers/revenueController');
const protect = require('../middleware/auth');
const requireRole = require('../middleware/requireRole');

const router = express.Router();

router.get('/daily', protect, requireRole('owner'), getDailyRevenue);
router.post('/daily', protect, requireRole('owner'), createManualRevenue);

module.exports = router;
