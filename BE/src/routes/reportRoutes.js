const express = require('express');
const { getProfitReport, getDayDetail } = require('../controllers/reportController');
const protect = require('../middleware/auth');
const requireRole = require('../middleware/requireRole');

const router = express.Router();

router.get('/profit', protect, requireRole('owner'), getProfitReport);
router.get('/day-detail', protect, requireRole('owner'), getDayDetail);

module.exports = router;
