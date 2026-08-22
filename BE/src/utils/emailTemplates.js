function formatCurrency(amount) {
  return `${Number(amount).toLocaleString('vi-VN')}đ`;
}

function formatDateTimeVi(value) {
  return new Date(value).toLocaleString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function infoRow(label, value) {
  return `
    <tr>
      <td style="padding:6px 0;color:#8a7362;font-size:14px;white-space:nowrap;">${label}</td>
      <td style="padding:6px 0;color:#4A2E1E;font-size:14px;text-align:right;font-weight:600;">${value}</td>
    </tr>
  `;
}

function buildNewOrderEmail({ order, customer, itemLabels }) {
  const itemsHtml = order.items
    .map((item, index) => {
      const label = itemLabels[index] || 'Sản phẩm';
      return `
        <tr>
          <td style="padding:10px 0;border-bottom:1px solid #F0E4D8;">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td style="vertical-align:top;">
                  <span style="color:#C9A876;font-size:14px;">●</span>
                  <span style="color:#4A2E1E;font-size:15px;font-weight:600;">
                    ${label}${item.sizeLabel ? ` (${item.sizeLabel})` : ''}
                  </span>
                  <span style="color:#8a7362;font-size:14px;"> x${item.quantity}</span>
                  ${
                    item.note
                      ? `<div style="color:#8a7362;font-size:13px;font-style:italic;margin-top:2px;padding-left:16px;">Ghi chú: ${item.note}</div>`
                      : ''
                  }
                </td>
                <td style="vertical-align:top;text-align:right;white-space:nowrap;color:#4A2E1E;font-size:14px;font-weight:600;">
                  ${formatCurrency(item.price * item.quantity)}
                </td>
              </tr>
            </table>
          </td>
        </tr>
      `;
    })
    .join('');

  const html = `
  <div style="background-color:#F3E4D3;padding:32px 16px;font-family:Georgia,'Times New Roman',serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;margin:0 auto;background:#FFFFFF;border-radius:20px;overflow:hidden;">
      <tr>
        <td style="background-color:#7C2128;padding:28px 24px;text-align:center;">
          <div style="color:#F3E4D3;font-size:13px;letter-spacing:2px;text-transform:uppercase;margin-bottom:6px;">
            🎂 Đơn hàng mới
          </div>
          <div style="color:#FFFFFF;font-size:22px;font-weight:bold;">Ngô Như Cake Studio</div>
        </td>
      </tr>
      <tr>
        <td style="padding:24px 24px 8px 24px;font-family:Arial,Helvetica,sans-serif;">
          <p style="margin:0 0 4px 0;color:#a08a76;font-size:12px;font-family:monospace;">Mã đơn: ${order._id}</p>
          <p style="margin:0;color:#4A2E1E;font-size:16px;">
            Khách hàng: <strong>${customer.name}</strong> — ${customer.phone}
          </p>
        </td>
      </tr>
      <tr>
        <td style="padding:16px 24px;font-family:Arial,Helvetica,sans-serif;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
            ${itemsHtml}
          </table>
        </td>
      </tr>
      <tr>
        <td style="padding:8px 24px 20px 24px;font-family:Arial,Helvetica,sans-serif;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
            ${infoRow('Ngày giờ nhận', formatDateTimeVi(order.deliveryDate))}
            ${infoRow('Nhận hàng', order.deliveryMethod === 'pickup' ? 'Tự lấy tại tiệm' : 'Giao tận nơi')}
            ${order.deliveryMethod === 'delivery' ? infoRow('Địa chỉ', customer.address || '') : ''}
            ${infoRow('Thanh toán', order.paymentMethod === 'qr' ? 'Chuyển khoản QR' : 'Thanh toán khi nhận (COD)')}
          </table>
        </td>
      </tr>
      <tr>
        <td style="padding:0 24px 24px 24px;font-family:Arial,Helvetica,sans-serif;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#F3E4D3;border-radius:12px;">
            <tr>
              <td style="padding:14px 18px;color:#4A2E1E;font-size:15px;font-weight:600;">Tổng tiền</td>
              <td style="padding:14px 18px;text-align:right;color:#7C2128;font-size:20px;font-weight:bold;">
                ${formatCurrency(order.totalAmount)}
              </td>
            </tr>
          </table>
        </td>
      </tr>
      <tr>
        <td style="padding:16px 24px;border-top:1px solid #F0E4D8;text-align:center;font-family:Arial,Helvetica,sans-serif;">
          <p style="margin:0;color:#a08a76;font-size:12px;">Ngô Như Cake Studio · 0981 398 552</p>
        </td>
      </tr>
    </table>
  </div>
  `;

  return {
    subject: `🎂 Đơn hàng mới từ ${customer.name} — ${formatCurrency(order.totalAmount)}`,
    html,
  };
}

module.exports = { buildNewOrderEmail };
