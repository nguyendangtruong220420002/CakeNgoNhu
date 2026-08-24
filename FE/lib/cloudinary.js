const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

export async function uploadImageToCloudinary(file) {
  if (!CLOUD_NAME || !UPLOAD_PRESET) {
    throw new Error(
      'Chưa cấu hình Cloudinary (NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME / NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET)'
    );
  }

  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', UPLOAD_PRESET);

  const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
    method: 'POST',
    body: formData,
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error?.message || 'Tải ảnh lên thất bại');
  }

  return data.secure_url;
}

// Ảnh mẫu bánh thường có card thương hiệu (logo, SĐT, địa chỉ) chèn ở góc dưới ảnh gốc.
// Khi hiển thị dạng thumbnail nhỏ (48-64px), phần card đó bị bóp vỡ thành mấy chấm khó nhìn.
// Hàm này cắt bớt dải dưới ảnh (nơi card luôn nằm) trước khi resize, chỉ dùng cho thumbnail nhỏ —
// ảnh gốc trên Cloudinary không bị thay đổi, gallery/ảnh chi tiết vẫn hiển thị đầy đủ như cũ.
export function cloudinaryThumbUrl(url, size = 128) {
  if (!url || typeof url !== 'string' || !url.includes('/upload/')) return url;
  return url.replace('/upload/', `/upload/c_fill,g_north,ar_1.28/c_fill,g_center,w_${size},h_${size}/`);
}

// Ảnh gallery chính (chi tiết sản phẩm) không cần tải nguyên bản gốc (có thể vài MB) —
// chỉ cần đủ nét cho khung hiển thị. Giới hạn chiều rộng + nén chất lượng để tải nhanh,
// đặc biệt quan trọng với sản phẩm có nhiều ảnh (vd "Bánh Kem Đa Dạng").
export function cloudinaryDetailUrl(url, width = 900) {
  if (!url || typeof url !== 'string' || !url.includes('/upload/')) return url;
  return url.replace('/upload/', `/upload/c_limit,w_${width},q_auto,f_auto/`);
}
