const mongoose = require('mongoose');
const Product = require('../models/Product');
const asyncHandler = require('../middleware/asyncHandler');

function isValidId(id) {
  return mongoose.Types.ObjectId.isValid(id);
}

const getProducts = asyncHandler(async function (req, res) {
  const { category } = req.query;
  const filter = { isActive: true, ...(category ? { category } : {}) };
  const products = await Product.find(filter).sort({ createdAt: -1 });
  res.json(products);
});

const getAdminProducts = asyncHandler(async function (req, res) {
  const { category } = req.query;
  const filter = category ? { category } : {};
  const products = await Product.find(filter).sort({ createdAt: -1 });
  res.json(products);
});

const getProductById = asyncHandler(async function (req, res) {
  const { id } = req.params;
  if (!isValidId(id)) {
    return res.status(400).json({ message: 'ID không hợp lệ' });
  }

  const product = await Product.findById(id);
  if (!product) {
    return res.status(404).json({ message: 'Không tìm thấy mẫu bánh' });
  }

  res.json(product);
});

const createProduct = asyncHandler(async function (req, res) {
  if (!req.body.name?.vi?.trim()) {
    return res.status(400).json({ message: 'Vui lòng nhập tên mẫu bánh (Tiếng Việt)' });
  }

  const product = await Product.create(req.body);
  res.status(201).json(product);
});

const updateProduct = asyncHandler(async function (req, res) {
  const { id } = req.params;
  if (!isValidId(id)) {
    return res.status(400).json({ message: 'ID không hợp lệ' });
  }
  if (req.body.name && !req.body.name.vi?.trim()) {
    return res.status(400).json({ message: 'Vui lòng nhập tên mẫu bánh (Tiếng Việt)' });
  }

  const product = await Product.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!product) {
    return res.status(404).json({ message: 'Không tìm thấy mẫu bánh' });
  }

  res.json(product);
});

const deleteProduct = asyncHandler(async function (req, res) {
  const { id } = req.params;
  if (!isValidId(id)) {
    return res.status(400).json({ message: 'ID không hợp lệ' });
  }

  const product = await Product.findByIdAndDelete(id);
  if (!product) {
    return res.status(404).json({ message: 'Không tìm thấy mẫu bánh' });
  }

  res.status(204).send();
});

module.exports = {
  getProducts,
  getAdminProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
