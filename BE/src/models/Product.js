const mongoose = require('mongoose');

const sizeSchema = new mongoose.Schema(
  {
    label: { type: String, required: true },
    price: { type: Number, required: true },
  },
  { _id: false }
);

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, default: '' },
    images: { type: [String], default: [] },
    category: { type: String, required: true },
    sizes: { type: [sizeSchema], default: [] },
    isActive: { type: Boolean, default: true },
    tags: { type: [String], default: [] }, // "Hot", "Mới"
  },
  { timestamps: true }
);

module.exports = mongoose.model('Product', productSchema);
