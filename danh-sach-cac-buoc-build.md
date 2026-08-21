# DANH SÁCH CÁC BƯỚC BUILD — CakeNgonNhu

Copy từng bước bên dưới, dán vào khung chat AI trong VSCode (Copilot/Cursor/Claude Code...), làm xong bước nào thì qua bước đó, đừng dán hết 1 lần.

Thư mục gốc hiện có: `CakeNgonNhu/` (chứa `CLAUDE.md`, `phan-tich-website-banh-kem.md`)

---

### Bước 0 — Khởi tạo cấu trúc project
```
Đọc file CLAUDE.md trong thư mục gốc. Khởi tạo cấu trúc project với 2 thư mục con:
- FE/ : Next.js + Tailwind CSS (frontend, gồm cả web khách hàng và trang admin)
- BE/ : Node.js + Express + Mongoose (backend API kết nối MongoDB)
Setup package.json, cấu hình Tailwind với bảng màu kem trong CLAUDE.md, tạo file .env.example (không điền giá trị thật) cho cả 2 thư mục.
```

### Bước 1 — Kết nối Database (BE)
```
Trong thư mục BE, tạo kết nối MongoDB bằng Mongoose, đọc connection string từ biến môi trường MONGODB_URI trong .env (không hardcode). Tạo các Mongoose models theo đúng cấu trúc collection trong CLAUDE.md: Product, Order, RevenueDaily, ExpenseCategory, Expense, Customer.
```

### Bước 2 — API cho mẫu bánh
```
Trong BE, tạo API CRUD cho Product (mẫu bánh): GET danh sách (lọc theo category), GET chi tiết theo id, POST thêm mới, PUT sửa, DELETE xóa.
```

### Bước 3 — Trang chủ web khách hàng (FE)
```
Trong FE, tạo trang chủ theo Style Guide màu kem trong CLAUDE.md: hero giới thiệu, danh sách mẫu bánh nổi bật (gọi API GET /products), nút "Gọi ngay" và "Đặt bánh ngay" dính cố định ở cuối màn hình khi xem trên điện thoại.
```

### Bước 4 — Danh mục + chi tiết mẫu bánh (FE)
```
Tạo trang danh mục mẫu bánh (lọc theo loại, giá, dịp) và trang chi tiết mẫu bánh (nhiều ảnh, mô tả, các size + giá riêng từng size, nút Đặt bánh).
```

### Bước 5 — Giỏ hàng & đặt hàng (FE + BE)
```
Tạo luồng giỏ hàng: chọn mẫu → chọn size → ghi chú (chữ trên bánh, yêu cầu riêng) → chọn ngày giờ nhận → chọn giao hàng hoặc tự lấy tại tiệm. Tạo API POST /orders ở BE để lưu đơn hàng vào MongoDB.
```

### Bước 6 — Thanh toán (FE + BE)
```
Tạo trang thanh toán: hiển thị mã QR VietQR để chuyển khoản, hoặc chọn thanh toán COD. Lưu paymentMethod và paymentStatus vào đơn hàng.
```

### Bước 7 — Đăng nhập admin (FE + BE)
```
Tạo trang đăng nhập cho admin (chủ tiệm/nhân viên), dùng JWT hoặc NextAuth. Phân quyền: chủ tiệm xem tất cả, nhân viên chỉ xem đơn hàng và nhập chi tiêu.
```

### Bước 8 — Quản lý mẫu bánh & đơn hàng (Admin)
```
Tạo trang admin quản lý mẫu bánh (thêm/sửa/xóa, bật/tắt hiển thị) và trang quản lý đơn hàng (danh sách theo trạng thái, cập nhật trạng thái đơn).
```

### Bước 9 — Quản lý doanh thu theo ngày (Admin)
```
Tạo trang admin quản lý doanh thu: bảng doanh thu theo ngày, tổng hợp tự động theo tuần/tháng, biểu đồ doanh thu theo thời gian. Tạo API tương ứng ở BE.
```

### Bước 10 — Quản lý chi tiêu theo mục (Admin)
```
Tạo trang admin quản lý chi tiêu theo danh mục (nguyên vật liệu, bao bì, nhân công, mặt bằng, marketing, vận chuyển, khác). Cho phép thêm/sửa/xóa mục chi tiêu tùy chỉnh. Mỗi khoản chi ghi ngày, mục, số tiền, ghi chú, người chi.
```

### Bước 11 — Báo cáo lợi nhuận (Admin)
```
Tạo trang báo cáo lợi nhuận, tự động tính: Lợi nhuận ngày = Tổng doanh thu ngày − Tổng chi tiêu ngày. Cho xem theo ngày/tuần/tháng, có nút xuất Excel/PDF.
```

### Bước 12 — Tối ưu responsive toàn bộ
```
Kiểm tra và tối ưu lại toàn bộ giao diện (cả web khách hàng và admin) cho hiển thị tốt trên điện thoại: ảnh load nhanh, form gọn, bảng số liệu admin cuộn ngang được trên màn hình nhỏ.
```

### Bước 13 (sau này) — Tích hợp thanh toán tự động
```
Tích hợp thêm cổng thanh toán Momo/ZaloPay/PayOS để tự động xác nhận đơn khi khách thanh toán, thay vì đối chiếu tay qua QR.
```

---

## Lưu ý quan trọng khi đưa cho AI trong VSCode

- **Không dán connection string MongoDB thật** vào bất kỳ đoạn chat nào với AI — chỉ tự tay điền vào file `.env` trên máy, ngoài phạm vi chat.
- File `.env` phải nằm trong `.gitignore`, không commit lên Git.
- Làm xong mỗi bước, chạy thử (`npm run dev`) trước khi qua bước tiếp theo — dễ phát hiện lỗi sớm hơn là làm hết rồi mới test.
