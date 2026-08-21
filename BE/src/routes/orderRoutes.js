const express = require('express');
const {
  createOrder,
  createManualOrder,
  updateManualOrder,
  deleteOrder,
  getOrders,
  updateOrderStatus,
} = require('../controllers/orderController');
const protect = require('../middleware/auth');
const requireRole = require('../middleware/requireRole');

const router = express.Router();

router.post('/', createOrder);
router.post('/manual', protect, requireRole('owner'), createManualOrder);
router.get('/', protect, getOrders);
router.put('/:id/status', protect, requireRole('owner'), updateOrderStatus);
router.put('/:id/manual', protect, requireRole('owner'), updateManualOrder);
router.delete('/:id', protect, requireRole('owner'), deleteOrder);

module.exports = router;
