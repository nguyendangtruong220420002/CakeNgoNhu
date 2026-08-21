export default function RevenueTable({ days }) {
  if (days.length === 0) {
    return <p className="text-text/60">Chưa có dữ liệu doanh thu trong 30 ngày gần đây.</p>;
  }

  const totalRevenue = days.reduce((sum, d) => sum + d.totalRevenue, 0);
  const totalOrders = days.reduce((sum, d) => sum + d.totalOrderCount, 0);

  return (
    <div className="overflow-x-auto">
      <table className="w-full bg-white/60 rounded-2xl overflow-hidden">
        <thead>
          <tr className="text-left text-text/70 text-sm border-b border-primary/20">
            <th className="px-4 py-3">Ngày</th>
            <th className="px-4 py-3">Doanh thu online</th>
            <th className="px-4 py-3">Doanh thu nhập tay</th>
            <th className="px-4 py-3">Tổng doanh thu</th>
            <th className="px-4 py-3">Số đơn</th>
          </tr>
        </thead>
        <tbody>
          {days.map((day) => (
            <tr key={day.date} className="border-b border-primary/10 last:border-0">
              <td className="px-4 py-3 text-text/70 text-sm whitespace-nowrap">
                {new Date(day.date).toLocaleDateString('vi-VN')}
              </td>
              <td className="px-4 py-3 text-text/70 text-sm">
                {day.autoRevenue.toLocaleString('vi-VN')}đ
              </td>
              <td className="px-4 py-3 text-text/70 text-sm">
                {day.manualRevenue.toLocaleString('vi-VN')}đ
              </td>
              <td className="px-4 py-3 text-text font-medium">
                {day.totalRevenue.toLocaleString('vi-VN')}đ
              </td>
              <td className="px-4 py-3 text-text/70 text-sm">{day.totalOrderCount}</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td className="px-4 py-3 font-medium text-text" colSpan={3}>
              Tổng 30 ngày
            </td>
            <td className="px-4 py-3 font-medium text-text">
              {totalRevenue.toLocaleString('vi-VN')}đ
            </td>
            <td className="px-4 py-3 font-medium text-text">{totalOrders}</td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}
