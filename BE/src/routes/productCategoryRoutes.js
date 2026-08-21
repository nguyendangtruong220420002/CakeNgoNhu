const express = require('express');
const {
  getProductCategories,
  createProductCategory,
  updateProductCategory,
  deleteProductCategory,
} = require('../controllers/productCategoryController');
const protect = require('../middleware/auth');
const requireRole = require('../middleware/requireRole');

const router = express.Router();

router.get('/', protect, requireRole('owner'), getProductCategories);
router.post('/', protect, requireRole('owner'), createProductCategory);
router.put('/:id', protect, requireRole('owner'), updateProductCategory);
router.delete('/:id', protect, requireRole('owner'), deleteProductCategory);

module.exports = router;
