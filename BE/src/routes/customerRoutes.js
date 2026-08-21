const express = require('express');
const { getCustomers } = require('../controllers/customerController');
const protect = require('../middleware/auth');
const requireRole = require('../middleware/requireRole');

const router = express.Router();

router.get('/', protect, requireRole('owner'), getCustomers);

module.exports = router;
