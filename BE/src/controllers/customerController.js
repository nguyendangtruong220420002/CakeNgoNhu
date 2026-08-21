const Customer = require('../models/Customer');
const asyncHandler = require('../middleware/asyncHandler');

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function matchScore(customer, query) {
  const name = (customer.name || '').toLowerCase();
  const phone = (customer.phone || '').toLowerCase();

  if (name === query || phone === query) return 0;
  if (name.startsWith(query) || phone.startsWith(query)) return 1;
  return 2;
}

const getCustomers = asyncHandler(async function (req, res) {
  const { q } = req.query;
  const trimmed = (q || '').trim();

  const filter = trimmed
    ? {
        $or: [
          { name: new RegExp(escapeRegex(trimmed), 'i') },
          { phone: new RegExp(escapeRegex(trimmed), 'i') },
        ],
      }
    : {};

  const customers = await Customer.find(filter).populate({
    path: 'orderHistory',
    select: 'items totalAmount createdAt status source countInRevenue',
    populate: { path: 'items.productId', select: 'name' },
    options: { sort: { createdAt: -1 } },
  });

  if (trimmed) {
    const query = trimmed.toLowerCase();
    customers.sort((a, b) => matchScore(a, query) - matchScore(b, query));
  } else {
    customers.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
  }

  res.json(customers);
});

module.exports = { getCustomers };
