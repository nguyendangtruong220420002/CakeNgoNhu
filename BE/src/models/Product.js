const mongoose = require('mongoose');

const sizeSchema = new mongoose.Schema(
  {
    label: { type: String, required: true },
    price: { type: Number, required: true },
    status: {
      type: String,
      enum: ['available', 'out_of_stock', 'pre_order'],
      default: 'available',
    },
  },
  { _id: false }
);

const localizedTextSchema = new mongoose.Schema(
  {
    vi: { type: String, default: '' },
    en: { type: String, default: '' },
    zh: { type: String, default: '' },
    ko: { type: String, default: '' },
    ja: { type: String, default: '' },
  },
  { _id: false }
);

const productSchema = new mongoose.Schema(
  {
    name: { type: localizedTextSchema, required: true },
    description: { type: localizedTextSchema, default: () => ({}) },
    images: { type: [String], default: [] },
    category: { type: String, required: true },
    sizes: { type: [sizeSchema], default: [] },
    isActive: { type: Boolean, default: true },
    tags: { type: [String], default: [] }, // "Hot", "Mới"
  },
  { timestamps: true }
);

module.exports = mongoose.model('Product', productSchema);
