const mongoose = require('mongoose');
const ProductCategory = require('../models/ProductCategory');
const asyncHandler = require('../middleware/asyncHandler');

const DEFAULT_CATEGORIES = ['Sinh nhật', 'Cưới', 'Kem tươi', 'Fondant'];

function isValidId(id) {
  return mongoose.Types.ObjectId.isValid(id);
}

const getProductCategories = asyncHandler(async function (req, res) {
  const count = await ProductCategory.countDocuments();
  if (count === 0) {
    await ProductCategory.insertMany(
      DEFAULT_CATEGORIES.map((name) => ({ name, isDefault: true }))
    );
  }

  const categories = await ProductCategory.find().sort({ isDefault: -1, name: 1 });
  res.json(categories);
});

const createProductCategory = asyncHandler(async function (req, res) {
  const { name } = req.body;
  if (!name || !name.trim()) {
    return res.status(400).json({ message: 'Vui lòng nhập tên loại bánh' });
  }

  const existing = await ProductCategory.findOne({ name: name.trim() });
  if (existing) {
    return res.status(400).json({ message: 'Loại bánh này đã tồn tại' });
  }

  const category = await ProductCategory.create({ name: name.trim(), isDefault: false });
  res.status(201).json(category);
});

const updateProductCategory = asyncHandler(async function (req, res) {
  const { id } = req.params;
  const { name } = req.body;

  if (!isValidId(id)) {
    return res.status(400).json({ message: 'ID không hợp lệ' });
  }
  if (!name || !name.trim()) {
    return res.status(400).json({ message: 'Vui lòng nhập tên loại bánh' });
  }

  const category = await ProductCategory.findByIdAndUpdate(
    id,
    { name: name.trim() },
    { new: true, runValidators: true }
  );

  if (!category) {
    return res.status(404).json({ message: 'Không tìm thấy loại bánh' });
  }

  res.json(category);
});

const deleteProductCategory = asyncHandler(async function (req, res) {
  const { id } = req.params;
  if (!isValidId(id)) {
    return res.status(400).json({ message: 'ID không hợp lệ' });
  }

  const category = await ProductCategory.findById(id);
  if (!category) {
    return res.status(404).json({ message: 'Không tìm thấy loại bánh' });
  }
  if (category.isDefault) {
    return res.status(400).json({ message: 'Không thể xoá loại bánh mặc định' });
  }

  await category.deleteOne();
  res.status(204).send();
});

module.exports = {
  getProductCategories,
  createProductCategory,
  updateProductCategory,
  deleteProductCategory,
};
