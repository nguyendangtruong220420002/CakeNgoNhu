const mongoose = require('mongoose');
const Order = require('../models/Order');
const Customer = require('../models/Customer');
const Product = require('../models/Product');
const asyncHandler = require('../middleware/asyncHandler');

const createOrder = asyncHandler(async function (req, res) {
  const {
    productId,
    sizeLabel,
    quantity,
    note,
    deliveryDate,
    deliveryMethod,
    address,
    customerName,
    customerPhone,
    paymentMethod,
  } = req.body;

  if (!productId || !mongoose.Types.ObjectId.isValid(productId)) {
    return res.status(400).json({ message: 'Mẫu bánh không hợp lệ' });
  }
  if (!sizeLabel) {
    return res.status(400).json({ message: 'Vui lòng chọn size' });
  }
  if (!Number.isInteger(quantity) || quantity < 1) {
    return res.status(400).json({ message: 'Số lượng không hợp lệ' });
  }
  if (!deliveryDate || Number.isNaN(new Date(deliveryDate).getTime())) {
    return res.status(400).json({ message: 'Vui lòng chọn ngày giờ nhận' });
  }
  if (new Date(deliveryDate) < new Date()) {
    return res.status(400).json({ message: 'Ngày giờ nhận phải ở tương lai' });
  }
  if (!['pickup', 'delivery'].includes(deliveryMethod)) {
    return res.status(400).json({ message: 'Phương thức nhận hàng không hợp lệ' });
  }
  if (deliveryMethod === 'delivery' && !address) {
    return res.status(400).json({ message: 'Vui lòng nhập địa chỉ giao hàng' });
  }
  if (!['qr', 'cod'].includes(paymentMethod)) {
    return res.status(400).json({ message: 'Phương thức thanh toán không hợp lệ' });
  }
  if (!customerName || !customerPhone) {
    return res.status(400).json({ message: 'Vui lòng nhập tên và số điện thoại' });
  }

  const product = await Product.findById(productId);
  if (!product) {
    return res.status(404).json({ message: 'Không tìm thấy mẫu bánh' });
  }

  const size = product.sizes.find((s) => s.label === sizeLabel);
  if (!size) {
    return res.status(400).json({ message: 'Size không hợp lệ' });
  }

  const customer = await Customer.findOneAndUpdate(
    { phone: customerPhone },
    { name: customerName, phone: customerPhone, address: address || '' },
    { new: true, upsert: true, setDefaultsOnInsert: true }
  );

  const totalAmount = size.price * quantity;

  const order = await Order.create({
    customerId: customer._id,
    items: [
      {
        productId: product._id,
        sizeLabel: size.label,
        quantity,
        note: note || '',
        price: size.price,
      },
    ],
    deliveryDate,
    deliveryMethod,
    totalAmount,
    paymentMethod,
    paymentStatus: 'pending',
  });

  customer.orderHistory.push(order._id);
  await customer.save();

  res.status(201).json(order);
});

const ORDER_STATUSES = ['new', 'in_progress', 'completed', 'delivered', 'cancelled'];

const getOrders = asyncHandler(async function (req, res) {
  const { status } = req.query;
  const filter = status ? { status } : {};

  const orders = await Order.find(filter)
    .sort({ createdAt: -1 })
    .populate('customerId', 'name phone address')
    .populate('items.productId', 'name');

  res.json(orders);
});

const updateOrderStatus = asyncHandler(async function (req, res) {
  const { id } = req.params;
  const { status } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'ID không hợp lệ' });
  }
  if (!ORDER_STATUSES.includes(status)) {
    return res.status(400).json({ message: 'Trạng thái không hợp lệ' });
  }

  const order = await Order.findByIdAndUpdate(
    id,
    { status },
    { new: true, runValidators: true }
  )
    .populate('customerId', 'name phone address')
    .populate('items.productId', 'name');

  if (!order) {
    return res.status(404).json({ message: 'Không tìm thấy đơn hàng' });
  }

  res.json(order);
});

module.exports = { createOrder, getOrders, updateOrderStatus };
