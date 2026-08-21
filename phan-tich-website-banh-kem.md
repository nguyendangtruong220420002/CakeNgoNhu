# PHÂN TÍCH HỆ THỐNG WEBSITE TIỆM BÁNH KEM

## 1. Tổng quan hệ thống

Hệ thống gồm **3 phần chính**, dùng chung 1 cơ sở dữ liệu (database):

| Phần | Đối tượng dùng | Mục đích |
|---|---|---|
| **Web khách hàng** | Khách vãng lai, khách quen | Xem mẫu bánh, đặt bánh, xem giá |
| **Web quản lý (Admin)** | Chủ tiệm, nhân viên | Quản lý đơn hàng, doanh thu, chi tiêu |
| **Responsive / Mobile** | Cả 2 nhóm trên | Dùng tốt trên điện thoại |

> Có thể làm 1 web duy nhất, responsive tốt trên điện thoại (không cần app riêng), sẽ tiết kiệm chi phí và thời gian phát triển hơn nhiều so với làm app native.

---

## 1.1 Thông tin thương hiệu & liên hệ

| Thông tin | Nội dung |
|---|---|
| Tên tiệm | Ngô Như Cake Studio |
| Hotline / Zalo | 0981 398 552 |
| Địa chỉ | 158/1A Đường 22 Tháng 4, Phường An Phú, TP. Hồ Chí Minh |
| Google Maps | https://maps.app.goo.gl/4GrYjvELXJRQT9sU7 |
| Facebook | https://www.facebook.com/share/1HFgrNTTZU/?mibextid=wwXIfr |
| Logo | File `logo.png` (hoặc `.svg`), đặt tại `FE/public/logo.png` |

Các thông tin này hiển thị ở: **Header/Footer** (mọi trang), **nút Zalo/gọi ngay nổi (sticky)** trên mobile, **trang Liên hệ** (kèm bản đồ nhúng Google Maps), và **trang admin** (mục cài đặt cửa hàng) để dễ chỉnh sửa sau này thay vì hardcode cứng trong code.

---

## 2. WEB KHÁCH HÀNG (Storefront)

### Chức năng chính
- **Trang chủ**: banner, bánh nổi bật, bánh mới, khuyến mãi
- **Danh mục mẫu bánh**: lọc theo loại (sinh nhật, cưới, kem tươi, fondant...), theo giá, theo dịp (sinh nhật, khai trương, lễ...)
- **Chi tiết mẫu bánh**: hình ảnh (nhiều góc), mô tả, kích thước (size 16cm/20cm/25cm...), giá theo size, thời gian làm bánh
- **Đặt hàng / Giỏ hàng**:
  - Chọn mẫu → chọn size → ghi chú (chữ trên bánh, màu sắc, yêu cầu riêng)
  - Chọn ngày giờ nhận bánh
  - Chọn giao hàng hoặc tự lấy tại tiệm
- **Thanh toán**: chuyển khoản / COD / ví điện tử (Momo, ZaloPay)
- **Theo dõi đơn hàng**: trạng thái (đã nhận đơn → đang làm → hoàn thành → đã giao)
- **Liên hệ nhanh**: nút gọi điện, chat Zalo/Messenger nổi (rất quan trọng cho ngành F&B VN)
- **Đánh giá / review** của khách cũ (tăng tin cậy)

### Lưu ý UX cho mobile
- Nút "Đặt bánh ngay" và "Gọi ngay" luôn cố định (sticky) ở cuối màn hình điện thoại
- Ảnh bánh load nhanh, có thể pinch-zoom
- Form đặt hàng ngắn gọn, ít bước nhất có thể

---

## 3. WEB QUẢN LÝ (Admin/Dashboard)

### 3.1 Quản lý mẫu bánh (nội dung hiển thị bên khách)
- Thêm/sửa/xóa mẫu bánh: tên, ảnh, mô tả, các size + giá tương ứng
- Bật/tắt hiển thị (còn bán / ngừng bán)
- Sắp xếp thứ tự hiển thị, gắn nhãn "Hot", "Mới"

### 3.2 Quản lý đơn hàng
- Danh sách đơn theo trạng thái (mới, đang làm, hoàn thành, đã hủy)
- Chi tiết đơn: khách hàng, mẫu bánh, ngày giao, ghi chú, giá trị đơn

### 3.3 Quản lý doanh thu (theo ngày)
- **Bảng doanh thu theo ngày**: tổng tiền bán ra mỗi ngày, số đơn hàng
- **Doanh thu theo tháng/quý/năm** (tổng hợp tự động từ dữ liệu ngày)
- **Biểu đồ**: doanh thu theo thời gian, top mẫu bánh bán chạy
- Có thể nhập tay (nếu bán trực tiếp tại quầy không qua web) hoặc tự động cộng từ đơn hàng online

### 3.4 Quản lý chi tiêu (theo mục)
Đây là phần bạn nhấn mạnh — cần có **danh mục chi tiêu (categories)** để dễ theo dõi, ví dụ:

| Mục chi tiêu | Ví dụ |
|---|---|
| Nguyên vật liệu | bột, trứng, kem, socola, trái cây... |
| Bao bì | hộp bánh, túi, ruy băng |
| Nhân công | lương nhân viên, thợ làm bánh |
| Mặt bằng | tiền thuê, điện, nước |
| Marketing | quảng cáo Facebook, in ấn |
| Vận chuyển | ship, xăng xe |
| Khác | sửa máy móc, chi phí phát sinh |

- Mỗi khoản chi: **ngày, mục, số tiền, ghi chú, người chi**
- Có thể thêm/sửa/xóa mục chi tiêu tùy chỉnh

### 3.5 Báo cáo lợi nhuận (tự tính)
Đây là phần quan trọng nhất, hệ thống nên **tự động tính**:

```
Lợi nhuận ngày = Tổng doanh thu ngày − Tổng chi tiêu ngày
```

- Báo cáo theo ngày / tuần / tháng
- Xuất file Excel/PDF để lưu trữ, báo cáo

### 3.6 Quản lý khác
- Quản lý khách hàng (lịch sử mua, số điện thoại)
- Phân quyền nhân viên (chủ tiệm xem hết, nhân viên chỉ xem đơn/nhập chi tiêu)

---

## 4. GỢI Ý CƠ SỞ DỮ LIỆU (Database) — cấu trúc chính

- `products` (mẫu bánh): id, tên, mô tả, ảnh, danh mục
- `product_sizes`: id, product_id, size, giá
- `orders` (đơn hàng): id, khách hàng, ngày đặt, ngày giao, trạng thái, tổng tiền
- `order_items`: id, order_id, product_id, size, số lượng, ghi chú
- `revenue_daily`: ngày, tổng doanh thu (có thể tính từ orders hoặc nhập tay)
- `expense_categories`: id, tên mục chi tiêu
- `expenses`: id, category_id, ngày, số tiền, ghi chú
- `customers`: id, tên, sđt, địa chỉ

---

## 5. PHƯƠNG THỨC THANH TOÁN

| Hình thức | Cách hoạt động | Độ khó triển khai |
|---|---|---|
| **Chuyển khoản + mã QR (VietQR)** | Khách quét QR ngân hàng, chuyển khoản, gửi ảnh xác nhận hoặc admin tự đối chiếu | Dễ nhất, miễn phí, không cần tích hợp cổng thanh toán |
| **Momo / ZaloPay** | Tích hợp API cổng thanh toán, khách thanh toán ngay trên web, hệ thống tự xác nhận đơn | Cần đăng ký merchant, mất phí giao dịch (~1-2%) |
| **COD (thanh toán khi nhận)** | Khách trả tiền mặt khi nhận bánh/ship đến | Dễ, nhưng rủi ro bùng đơn |
| **Cổng thanh toán tổng hợp (VNPay, PayOS...)** | 1 lần tích hợp, hỗ trợ nhiều hình thức (thẻ, QR, ví) | Trung bình, phù hợp khi tiệm lớn dần |

**Gợi ý cho tiệm mới bắt đầu**: dùng **VietQR + COD** trước (không tốn phí, dễ làm), khi đơn hàng ổn định thì tích hợp thêm Momo/ZaloPay hoặc PayOS để tự động hóa xác nhận thanh toán, đỡ phải đối chiếu tay.

---

## 6. NHẬN DIỆN THƯƠNG HIỆU — TÔNG KEM BE & ĐỎ MẬN

Cập nhật theo đúng bảng màu trong thiết kế menu thực tế của Ngô Như Cake Studio (kem be ấm + đỏ mận sang trọng, thay cho bản kem nhạt/caramel ban đầu):

| Vai trò | Mã màu | Mô tả |
|---|---|---|
| Nền chính | `#F3E4D3` | Kem be ấm |
| Nhấn chính (badge, tiêu đề, nút) | `#7C2128` | Đỏ mận đậm — màu chủ đạo thương hiệu |
| Nhấn đậm (hover, viền) | `#5E181E` | Đỏ mận tối hơn |
| Chữ chính | `#4A2E1E` | Nâu socola đậm, dễ đọc |
| Điểm nhấn phụ (viền, hoạ tiết) | `#C9A876` | Vàng đồng/gold nhạt |

**Nguyên tắc dùng màu:**
- Nền tổng thể luôn là kem be `#F3E4D3`, không dùng trắng tinh để giữ cảm giác ấm áp, thủ công
- Các khối tiêu đề lớn, badge số thứ tự, nút hành động chính (Đặt bánh, Thanh toán) dùng đỏ mận `#7C2128`, chữ trắng — tạo điểm nhấn sang trọng, nổi bật trên nền kem
- Chữ tiêu đề/nội dung dùng nâu socola `#4A2E1E` để tương phản tốt, dễ đọc
- Vàng đồng `#C9A876` dùng cho viền trang trí, icon, đường kẻ phân cách — không dùng làm nền lớn
- Web quản lý (admin) có thể dùng tông màu này nhẹ nhàng hơn, ưu tiên độ tương phản cho bảng số liệu (doanh thu/chi tiêu) dễ đọc

---

## 7. GỢI Ý CÔNG NGHỆ (Tech stack)

| Thành phần | Gợi ý |
|---|---|
| Frontend (web khách + admin) | React / Next.js (responsive tự động cho mobile) |
| Backend | Node.js hoặc dùng nền tảng no-code như Supabase/Firebase để làm nhanh |
| Database | **MongoDB Atlas** (đã có sẵn cluster) |
| Thanh toán | Momo, ZaloPay, chuyển khoản QR (VietQR) |
| Hosting | Vercel (frontend) + Railway/Render (backend) — chi phí thấp, dễ triển khai |

> ⚠️ **Lưu ý bảo mật database**: connection string MongoDB (có username/password) chỉ được dùng ở phía **backend/server**, lưu trong file `.env`, **không** để lộ trong code frontend hoặc commit lên Git/GitHub public. Nếu chuỗi kết nối từng bị dán ra ngoài (chat, tài liệu chia sẻ...), nên đổi lại mật khẩu user trong MongoDB Atlas → Database Access → Edit → Autogenerate password mới.

---

## 8. LỘ TRÌNH TRIỂN KHAI ĐỀ XUẤT

1. **Giai đoạn 1**: Web khách hàng đơn giản (xem mẫu bánh + đặt hàng qua Zalo/form) — làm nhanh, ra mắt sớm
2. **Giai đoạn 2**: Web quản lý cơ bản — nhập doanh thu, chi tiêu theo ngày, xem báo cáo
3. **Giai đoạn 3**: Tự động hóa — đơn hàng online tự cộng vào doanh thu, thêm biểu đồ, phân quyền nhân viên

---

*Bạn cho mình biết quy mô tiệm (nhỏ lẻ hay chuỗi), có sẵn đội kỹ thuật không, và ngân sách dự kiến — mình sẽ tư vấn cụ thể hơn về công nghệ và chi phí phù hợp.*
