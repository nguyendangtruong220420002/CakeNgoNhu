const express = require('express');
const { createOrder, getOrders, updateOrderStatus } = require('../controllers/orderController');
const protect = require('../middleware/auth');
const requireRole = require('../middleware/requireRole');

const router = express.Router();

router.post('/', createOrder);
router.get('/', protect, getOrders);
router.put('/:id/status', protect, requireRole('owner'), updateOrderStatus);

module.exports = router;
