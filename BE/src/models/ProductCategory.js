const mongoose = require('mongoose');

const productCategorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true, trim: true },
  isDefault: { type: Boolean, default: false },
});

module.exports = mongoose.model('ProductCategory', productCategorySchema);
