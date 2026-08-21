# CLAUDE.md — Dự án Website Tiệm Bánh Kem

Đây là file chỉ dẫn cho AI (Claude Code hoặc công cụ tương tự) khi làm việc trên dự án này. Đọc kỹ trước khi code bất kỳ phần nào.

---

## 1. Mô tả dự án

Xây dựng hệ thống website cho tiệm bánh kem, gồm 2 phần dùng chung 1 database:

1. **Web khách hàng (storefront)** — khách xem mẫu bánh, đặt hàng, thanh toán
2. **Web quản lý (admin dashboard)** — chủ tiệm/nhân viên quản lý mẫu bánh, đơn hàng, doanh thu theo ngày, chi tiêu theo mục, báo cáo lợi nhuận

Bắt buộc **responsive tốt trên điện thoại** — không làm app riêng, chỉ 1 website đáp ứng tốt cả desktop và mobile.

Website hỗ trợ **đa ngôn ngữ**: Tiếng Việt, English, 中文 (Trung), 한국어 (Hàn), 日本語 (Nhật).

---

## 1.1 Thông tin thương hiệu & liên hệ

| Thông tin | Nội dung |
|---|---|
| Tên tiệm | Ngô Như Cake Studio |
| Hotline / Zalo | 0981 398 552 |
| Địa chỉ | 158/1A Đường 22 Tháng 4, Phường An Phú, TP. Hồ Chí Minh |
| Google Maps | https://maps.app.goo.gl/4GrYjvELXJRQT9sU7 |
| Facebook | https://www.facebook.com/share/1HFgrNTTZU/?mibextid=wwXIfr |

Các thông tin này hiển thị ở: **Header/Footer** (mọi trang), **nút Zalo/gọi ngay nổi (sticky)** trên mobile, **trang Liên hệ** (kèm bản đồ nhúng Google Maps), và **trang admin** (mục cài đặt cửa hàng) để dễ chỉnh sửa sau này thay vì hardcode cứng trong code.

---

## 2. Công nghệ sử dụng

| Thành phần | Công nghệ |
|---|---|
| Frontend | Next.js (React) + Tailwind CSS |
| Backend | Next.js API routes hoặc Node.js/Express riêng |
| Database | MongoDB (Mongoose ODM) |
| Xác thực (admin) | NextAuth.js hoặc JWT tự viết |
| Thanh toán | VietQR (giai đoạn đầu) → tích hợp Momo/ZaloPay/PayOS sau |
| Đa ngôn ngữ (i18n) | `next-intl` hoặc `next-i18next` |
| Hosting | Vercel (frontend/API) |

**Kết nối database**: connection string MongoDB đọc từ biến môi trường `MONGODB_URI` trong file `.env.local`. **Không bao giờ hardcode** connection string, username, password trong code. File `.env.local` phải nằm trong `.gitignore`, không commit lên Git.

---

## 3. Thiết kế / Style Guide

### Tông màu chủ đạo — màu kem

```css
--color-background: #F3E4D3;   /* Nền chính — kem be ấm */
--color-primary: #7C2128;      /* Nút, tiêu đề, badge, hành động chính — đỏ mận đậm */
--color-primary-dark: #5E181E; /* Hover, viền — đỏ mận tối hơn */
--color-text: #4A2E1E;         /* Chữ chính — nâu socola đậm */
--color-accent: #C9A876;       /* Điểm nhấn phụ — vàng đồng/gold (viền, hoạ tiết trang trí) */
```

### Nguyên tắc dùng màu
- Nền tổng thể luôn dùng `--color-background`, không dùng trắng tinh (#FFFFFF) để giữ cảm giác ấm áp
- Nút hành động chính (Đặt bánh, Thanh toán) dùng `--color-primary`, chữ trắng, bo góc mềm (rounded-xl)
- Chữ tiêu đề/nội dung dùng `--color-text` để tương phản tốt, dễ đọc
- `--color-accent` chỉ dùng làm điểm nhấn nhỏ, không dùng làm nền lớn
- Trang admin dùng tông màu này nhẹ nhàng hơn, ưu tiên độ tương phản rõ cho bảng số liệu (doanh thu/chi tiêu)

### Cảm giác thiết kế mong muốn
Ấm áp, sang trọng vừa phải, gần gũi kiểu tiệm bánh thủ công (không lạnh/công nghiệp). Ảnh bánh cần lớn, nổi bật, nhiều khoảng trắng (whitespace), font chữ mềm mại (có thể dùng font serif nhẹ cho tiêu đề, sans-serif cho nội dung). Bo góc mềm cho card/button, tránh góc vuông cứng.

### Responsive / Mobile
- Nút "Đặt bánh ngay" và "Gọi ngay" cố định (sticky) ở cuối màn hình khi xem trên mobile
- Ảnh bánh tối ưu tốc độ tải (lazy load, kích thước phù hợp), hỗ trợ pinch-zoom
- Form đặt hàng tối giản, ít bước nhất có thể trên màn hình nhỏ

---

## 4. Chức năng — Web khách hàng

- **Trang chủ**: banner, bánh nổi bật, bánh mới, khuyến mãi
- **Danh mục mẫu bánh**: lọc theo loại (sinh nhật, cưới, kem tươi, fondant...), theo giá, theo dịp
- **Chi tiết mẫu bánh**: nhiều ảnh, mô tả, các size (VD 16cm/20cm/25cm) với giá riêng từng size, thời gian làm bánh dự kiến
- **Giỏ hàng / Đặt hàng**: chọn mẫu → chọn size → ghi chú (chữ trên bánh, màu sắc, yêu cầu riêng) → chọn ngày giờ nhận → chọn giao hàng hoặc tự lấy tại tiệm
- **Thanh toán**: hiển thị mã VietQR để chuyển khoản, hoặc chọn COD
- **Theo dõi đơn hàng**: trạng thái đơn (Mới nhận → Đang làm → Hoàn thành → Đã giao)
- **Liên hệ nhanh**: nút gọi điện (0981 398 552) và chat Zalo nổi cố định, footer có địa chỉ (kèm link Google Maps) và link Facebook
- **Đánh giá/review** từ khách cũ
- **Chuyển đổi ngôn ngữ**: nút chọn ngôn ngữ (cờ hoặc dropdown) ở header — Tiếng Việt, English, 中文, 한국어, 日本語. Mặc định là Tiếng Việt.

---

## 5. Chức năng — Web quản lý (Admin)

### 5.1 Quản lý mẫu bánh
CRUD mẫu bánh: tên, mô tả, ảnh (nhiều ảnh), danh mục, các size + giá tương ứng, trạng thái hiển thị (đang bán/ngừng bán), nhãn (Hot/Mới).

### 5.2 Quản lý đơn hàng
Danh sách đơn theo trạng thái, xem chi tiết, cập nhật trạng thái đơn, lọc theo ngày/khách hàng.

### 5.3 Quản lý doanh thu theo ngày
- Bảng doanh thu theo từng ngày: tổng tiền, số đơn hàng
- Tổng hợp tự động theo tuần/tháng/quý/năm
- Biểu đồ doanh thu theo thời gian, top mẫu bánh bán chạy
- Cho phép nhập tay (trường hợp bán trực tiếp tại quầy, không qua web)

### 5.4 Quản lý chi tiêu theo mục (category)
Danh mục chi tiêu mặc định (có thể thêm/sửa/xóa tùy chỉnh):
- Nguyên vật liệu (bột, trứng, kem, socola, trái cây...)
- Bao bì (hộp bánh, túi, ruy băng)
- Nhân công (lương nhân viên, thợ làm bánh)
- Mặt bằng (tiền thuê, điện, nước)
- Marketing (quảng cáo, in ấn)
- Vận chuyển (ship, xăng xe)
- Khác

Mỗi khoản chi ghi: ngày, mục, số tiền, ghi chú, người chi.

### 5.5 Báo cáo lợi nhuận (tự động tính)
```
Lợi nhuận ngày = Tổng doanh thu ngày − Tổng chi tiêu ngày
```
Xem theo ngày/tuần/tháng, xuất Excel/PDF.

### 5.6 Khác
- Quản lý khách hàng (lịch sử mua, thông tin liên hệ)
- Phân quyền: chủ tiệm (xem tất cả) vs nhân viên (chỉ xem đơn hàng, nhập chi tiêu)

### 5.7 Quản lý nội dung đa ngôn ngữ
- Tên và mô tả mẫu bánh cần nhập được bằng cả 5 ngôn ngữ (VI/EN/中文/한국어/日本語) trong form thêm/sửa mẫu bánh
- Nếu admin chưa nhập bản dịch cho 1 ngôn ngữ, hệ thống tự fallback về Tiếng Việt để tránh trang trống
- Thông tin cửa hàng (hotline, địa chỉ, Facebook) có mục cài đặt riêng để admin chỉnh sửa, không hardcode trong code

---

## 6. Cấu trúc Database (MongoDB Collections)

```js
// products — mẫu bánh (tên/mô tả đa ngôn ngữ)
{
  _id,
  name: { vi: String, en: String, zh: String, ko: String, ja: String },
  description: { vi: String, en: String, zh: String, ko: String, ja: String },
  images: [String],
  category: String,
  sizes: [{ label: String, price: Number }],
  isActive: Boolean,
  tags: [String], // "Hot", "Mới"
  createdAt, updatedAt
}

// storeSettings — thông tin cửa hàng (admin chỉnh sửa được, không hardcode)
{
  _id, storeName: String, hotline: String, zalo: String,
  address: String, googleMapsUrl: String, facebookUrl: String
}

// orders — đơn hàng
{
  _id, customerId, items: [{
    productId, sizeLabel, quantity, note, price
  }],
  deliveryDate: Date,
  deliveryMethod: String, // "pickup" | "delivery"
  status: String, // "new" | "in_progress" | "completed" | "delivered" | "cancelled"
  totalAmount: Number,
  paymentMethod: String, // "qr" | "cod" | "momo" | "zalopay"
  paymentStatus: String, // "pending" | "paid"
  createdAt, updatedAt
}

// revenueDaily — doanh thu theo ngày (tổng hợp hoặc nhập tay)
{
  _id, date: Date, totalRevenue: Number, orderCount: Number, source: String // "auto" | "manual"
}

// expenseCategories — danh mục chi tiêu
{
  _id, name: String, isDefault: Boolean
}

// expenses — khoản chi
{
  _id, categoryId, date: Date, amount: Number, note: String, createdBy: String
}

// customers — khách hàng
{
  _id, name, phone, address, orderHistory: [ObjectId] // ref orders
}
```

---

## 7. Biến môi trường cần thiết (.env.local)

```
MONGODB_URI=          # connection string MongoDB, KHÔNG commit file này
NEXTAUTH_SECRET=
NEXTAUTH_URL=
```

> ⚠️ File `.env.local` phải nằm trong `.gitignore`. Không bao giờ dán connection string thật vào code, tài liệu, hoặc chat.

---

## 8. Lộ trình build (làm theo thứ tự)

1. Setup project Next.js + Tailwind, cấu hình màu theo Style Guide (mục 3)
2. Kết nối MongoDB, tạo models theo mục 6
3. Web khách hàng: trang chủ → danh mục → chi tiết mẫu bánh → giỏ hàng/đặt hàng
4. Thanh toán: hiển thị QR VietQR + chọn COD
5. Admin: đăng nhập → quản lý mẫu bánh → quản lý đơn hàng
6. Admin: quản lý doanh thu theo ngày + quản lý chi tiêu theo mục
7. Admin: báo cáo lợi nhuận (biểu đồ + xuất file)
8. Tối ưu responsive/mobile toàn bộ hệ thống
9. (Sau này) Tích hợp Momo/ZaloPay/PayOS để tự động xác nhận thanh toán

**Quy tắc làm việc**: build từng phần nhỏ theo thứ tự trên, không làm toàn bộ hệ thống trong 1 lần. Sau mỗi phần, kiểm tra hiển thị đúng trên cả desktop và mobile trước khi qua phần tiếp theo.
