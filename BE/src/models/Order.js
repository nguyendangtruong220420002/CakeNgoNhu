const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema(
  {
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    sizeLabel: { type: String, default: '' },
    quantity: { type: Number, required: true, min: 1 },
    note: { type: String, default: '' },
    price: { type: Number, required: true },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
    items: { type: [orderItemSchema], default: [] },
    deliveryDate: { type: Date, required: true },
    deliveryMethod: { type: String, enum: ['pickup', 'delivery'], required: true },
    status: {
      type: String,
      enum: ['new', 'in_progress', 'completed', 'delivered', 'cancelled'],
      default: 'new',
    },
    totalAmount: { type: Number, required: true },
    paymentMethod: { type: String, enum: ['qr', 'cod', 'momo', 'zalopay'], required: true },
    paymentStatus: { type: String, enum: ['pending', 'paid'], default: 'pending' },
    source: { type: String, enum: ['online', 'manual'], default: 'online' },
    countInRevenue: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Order', orderSchema);
