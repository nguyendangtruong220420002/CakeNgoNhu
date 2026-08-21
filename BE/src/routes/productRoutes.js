const express = require('express');
const {
  getProducts,
  getAdminProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} = require('../controllers/productController');
const protect = require('../middleware/auth');
const requireRole = require('../middleware/requireRole');

const router = express.Router();

router.get('/', getProducts);
router.get('/admin/all', protect, requireRole('owner'), getAdminProducts);
router.get('/:id', getProductById);
router.post('/', protect, requireRole('owner'), createProduct);
router.put('/:id', protect, requireRole('owner'), updateProduct);
router.delete('/:id', protect, requireRole('owner'), deleteProduct);

module.exports = router;
