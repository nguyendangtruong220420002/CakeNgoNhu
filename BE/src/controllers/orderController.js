const mongoose = require('mongoose');
const Order = require('../models/Order');
const Customer = require('../models/Customer');
const Product = require('../models/Product');
const asyncHandler = require('../middleware/asyncHandler');
const { ORDER_STATUSES } = require('../constants/orderStatus');

const createOrder = asyncHandler(async function (req, res) {
  const {
    productId,
    sizeLabel,
    quantity,
    note,
    image,
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
  if (size.status === 'out_of_stock') {
    return res.status(400).json({ message: 'Size này hiện đã hết hàng' });
  }

  const customer = await Customer.findOneAndUpdate(
    { phone: customerPhone },
    { name: customerName, phone: customerPhone, address: address || '' },
    { new: true, upsert: true, setDefaultsOnInsert: true }
  );

  const totalAmount = size.price * quantity;
  const selectedImage = image && product.images.includes(image) ? image : product.images[0] || '';

  const order = await Order.create({
    customerId: customer._id,
    items: [
      {
        productId: product._id,
        sizeLabel: size.label,
        quantity,
        note: note || '',
        price: size.price,
        image: selectedImage,
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

const createManualOrder = asyncHandler(async function (req, res) {
  const { customerPhone, customerName, quantity, price, date, note, countInRevenue } = req.body;

  if (!customerPhone || !customerPhone.trim()) {
    return res.status(400).json({ message: 'Vui lòng nhập số điện thoại khách hàng' });
  }
  if (!customerName || !customerName.trim()) {
    return res.status(400).json({ message: 'Vui lòng nhập họ tên khách hàng' });
  }
  if (!Number.isInteger(quantity) || quantity < 1) {
    return res.status(400).json({ message: 'Số lượng không hợp lệ' });
  }
  const unitPrice = Number(price);
  if (!Number.isFinite(unitPrice) || unitPrice < 0) {
    return res.status(400).json({ message: 'Giá không hợp lệ' });
  }

  const saleDate = date ? new Date(date) : new Date();
  if (Number.isNaN(saleDate.getTime())) {
    return res.status(400).json({ message: 'Ngày không hợp lệ' });
  }

  const customer = await Customer.findOneAndUpdate(
    { phone: customerPhone.trim() },
    { name: customerName.trim(), phone: customerPhone.trim() },
    { new: true, upsert: true, setDefaultsOnInsert: true }
  );

  const totalAmount = unitPrice * quantity;

  const order = await Order.create({
    customerId: customer._id,
    items: [
      {
        quantity,
        note: note ? note.trim() : '',
        price: unitPrice,
      },
    ],
    deliveryDate: saleDate,
    deliveryMethod: 'pickup',
    status: 'completed',
    totalAmount,
    paymentMethod: 'cod',
    paymentStatus: 'paid',
    source: 'manual',
    countInRevenue: Boolean(countInRevenue),
    createdAt: saleDate,
  });

  customer.orderHistory.push(order._id);
  await customer.save();

  const populated = await order.populate({ path: 'customerId', select: 'name phone address' });

  res.status(201).json(populated);
});

const updateManualOrder = asyncHandler(async function (req, res) {
  const { id } = req.params;
  const { quantity, price, note, date, countInRevenue } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'ID không hợp lệ' });
  }

  const order = await Order.findById(id);
  if (!order) {
    return res.status(404).json({ message: 'Không tìm thấy đơn hàng' });
  }
  if (!Number.isInteger(quantity) || quantity < 1) {
    return res.status(400).json({ message: 'Số lượng không hợp lệ' });
  }
  const unitPrice = Number(price);
  if (!Number.isFinite(unitPrice) || unitPrice < 0) {
    return res.status(400).json({ message: 'Giá không hợp lệ' });
  }
  const saleDate = date ? new Date(date) : order.deliveryDate;
  if (Number.isNaN(saleDate.getTime())) {
    return res.status(400).json({ message: 'Ngày không hợp lệ' });
  }

  // Giữ nguyên productId/sizeLabel/image của item gốc — chỉ cho sửa số lượng, giá, ghi chú
  const existingItem = order.items[0] || {};
  order.items = [
    {
      productId: existingItem.productId,
      sizeLabel: existingItem.sizeLabel || '',
      image: existingItem.image || '',
      quantity,
      note: note ? note.trim() : '',
      price: unitPrice,
    },
  ];
  order.totalAmount = unitPrice * quantity;
  order.deliveryDate = saleDate;
  order.countInRevenue = Boolean(countInRevenue);
  if (order.source === 'manual') {
    // Đơn tại quầy: ngày bán chính là ngày tạo đơn, dùng để gộp doanh thu theo ngày
    order.createdAt = saleDate;
  }

  await order.save();
  const populated = await order.populate([
    { path: 'customerId', select: 'name phone address' },
    { path: 'items.productId', select: 'name images' },
  ]);

  res.json(populated);
});

const deleteOrder = asyncHandler(async function (req, res) {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'ID không hợp lệ' });
  }

  const order = await Order.findByIdAndDelete(id);
  if (!order) {
    return res.status(404).json({ message: 'Không tìm thấy đơn hàng' });
  }

  await Customer.updateOne({ _id: order.customerId }, { $pull: { orderHistory: order._id } });

  res.status(204).send();
});

const getOrders = asyncHandler(async function (req, res) {
  const { status } = req.query;
  const filter = status ? { status } : {};

  const orders = await Order.find(filter)
    .sort({ createdAt: -1 })
    .populate('customerId', 'name phone address')
    .populate('items.productId', 'name images');

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
    .populate('items.productId', 'name images');

  if (!order) {
    return res.status(404).json({ message: 'Không tìm thấy đơn hàng' });
  }

  res.json(order);
});

module.exports = {
  createOrder,
  createManualOrder,
  updateManualOrder,
  deleteOrder,
  getOrders,
  updateOrderStatus,
};
