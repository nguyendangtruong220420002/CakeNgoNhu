const ORDER_STATUSES = ['new', 'in_progress', 'completed', 'delivered', 'cancelled'];

// Chỉ tính vào doanh thu khi đơn đã hoàn thành (hoặc đã giao, bước sau hoàn thành)
const REVENUE_STATUSES = ['completed', 'delivered'];

module.exports = { ORDER_STATUSES, REVENUE_STATUSES };
