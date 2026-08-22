'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { uploadImageToCloudinary } from '@/lib/cloudinary';
import ProductCategoryPicker from './ProductCategoryPicker';
import { LOCALES } from '@/lib/i18n/config';
import MoneyInput from '@/components/MoneyInput';

const API_URL = ''; // gọi qua rewrite cùng origin, xem next.config.js

const SIZE_STATUS_OPTIONS = [
  { value: 'available', label: 'Có sẵn' },
  { value: 'out_of_stock', label: 'Hết hàng' },
  { value: 'pre_order', label: 'Đặt trước' },
];

function emptyLocalizedText(source) {
  const result = {};
  for (const l of LOCALES) {
    result[l.code] = source?.[l.code] || '';
  }
  return result;
}

export default function ProductForm({ initialProduct, categories }) {
  const router = useRouter();
  const isEdit = Boolean(initialProduct);

  const [activeLang, setActiveLang] = useState('vi');
  const [name, setName] = useState(() => emptyLocalizedText(initialProduct?.name));
  const [description, setDescription] = useState(() =>
    emptyLocalizedText(initialProduct?.description)
  );
  const [category, setCategory] = useState(
    initialProduct?.category || categories[0]?.name || ''
  );
  const [images, setImages] = useState(
    initialProduct?.images?.length ? initialProduct.images : ['']
  );
  const [sizes, setSizes] = useState(
    initialProduct?.sizes?.length
      ? initialProduct.sizes.map((s) => ({ ...s, status: s.status || 'available' }))
      : [{ label: '', price: '', status: 'available' }]
  );
  const [isHot, setIsHot] = useState(initialProduct?.tags?.includes('Hot') || false);
  const [isNew, setIsNew] = useState(initialProduct?.tags?.includes('Mới') || false);
  const [isActive, setIsActive] = useState(initialProduct?.isActive ?? true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [uploadingIndex, setUploadingIndex] = useState(null);
  const [bulkUploading, setBulkUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');

  function updateName(locale, value) {
    setName((prev) => ({ ...prev, [locale]: value }));
  }

  function updateDescription(locale, value) {
    setDescription((prev) => ({ ...prev, [locale]: value }));
  }

  function updateImage(index, value) {
    setImages((prev) => prev.map((img, i) => (i === index ? value : img)));
  }

  function addImage() {
    setImages((prev) => [...prev, '']);
  }

  function removeImage(index) {
    setImages((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleFileUpload(index, file) {
    if (!file) return;
    setUploadError('');
    setUploadingIndex(index);
    try {
      const url = await uploadImageToCloudinary(file);
      updateImage(index, url);
    } catch (err) {
      setUploadError(err.message || 'Tải ảnh lên thất bại');
    } finally {
      setUploadingIndex(null);
    }
  }

  async function handleBulkUpload(fileList) {
    const files = Array.from(fileList || []);
    if (files.length === 0) return;

    setUploadError('');
    setBulkUploading(true);
    try {
      const results = await Promise.allSettled(files.map((file) => uploadImageToCloudinary(file)));
      const succeeded = results.filter((r) => r.status === 'fulfilled').map((r) => r.value);
      const failedCount = results.length - succeeded.length;

      if (succeeded.length > 0) {
        setImages((prev) => {
          const withoutEmpty = prev.filter((img) => img.trim());
          return [...withoutEmpty, ...succeeded];
        });
      }
      if (failedCount > 0) {
        setUploadError(`${failedCount} ảnh tải lên thất bại, vui lòng thử lại`);
      }
    } finally {
      setBulkUploading(false);
    }
  }

  function updateSize(index, field, value) {
    setSizes((prev) =>
      prev.map((size, i) => (i === index ? { ...size, [field]: value } : size))
    );
  }

  function addSize() {
    setSizes((prev) => [...prev, { label: '', price: '', status: 'available' }]);
  }

  function removeSize(index) {
    setSizes((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    const cleanImages = images.map((img) => img.trim()).filter(Boolean);
    const cleanSizes = sizes
      .filter((s) => s.label.trim() && s.price !== '')
      .map((s) => ({
        label: s.label.trim(),
        price: Number(s.price),
        status: s.status || 'available',
      }));
    const cleanName = Object.fromEntries(LOCALES.map((l) => [l.code, name[l.code].trim()]));
    const cleanDescription = Object.fromEntries(
      LOCALES.map((l) => [l.code, description[l.code].trim()])
    );

    if (!cleanName.vi || !category.trim()) {
      setError('Vui lòng nhập tên (Tiếng Việt) và danh mục');
      return;
    }

    const tags = [...(isHot ? ['Hot'] : []), ...(isNew ? ['Mới'] : [])];

    setSubmitting(true);
    try {
      const url = isEdit
        ? `${API_URL}/api/products/${initialProduct._id}`
        : `${API_URL}/api/products`;

      const res = await fetch(url, {
        method: isEdit ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          name: cleanName,
          description: cleanDescription,
          category: category.trim(),
          images: cleanImages,
          sizes: cleanSizes,
          tags,
          isActive,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || 'Lưu thất bại, vui lòng thử lại');
        return;
      }

      router.push('/admin/san-pham');
      router.refresh();
    } catch (err) {
      setError('Không thể kết nối tới server');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
      <div>
        <p className="text-text font-medium mb-2">Tên &amp; mô tả mẫu bánh</p>
        <div className="flex flex-wrap gap-2 mb-3">
          {LOCALES.map((l) => (
            <button
              key={l.code}
              type="button"
              onClick={() => setActiveLang(l.code)}
              className={`px-3 py-1.5 rounded-xl border text-sm transition-colors ${
                activeLang === l.code
                  ? 'bg-primary text-white border-primary'
                  : 'border-primary/40 text-text hover:border-primary'
              }`}
            >
              {l.flag} {l.label}
              {l.code !== 'vi' && !name[l.code].trim() && (
                <span className="ml-1 opacity-60">(trống)</span>
              )}
            </button>
          ))}
        </div>

        <div className="space-y-3">
          <div>
            <label className="block text-text font-medium mb-2" htmlFor="name">
              Tên mẫu bánh {activeLang === 'vi' && <span className="text-red-600">*</span>}
            </label>
            <input
              id="name"
              type="text"
              value={name[activeLang]}
              onChange={(e) => updateName(activeLang, e.target.value)}
              required={activeLang === 'vi'}
              className="w-full rounded-xl border border-primary/40 bg-white px-4 py-3 text-text focus:outline-none focus:border-primary"
            />
          </div>

          <div>
            <label className="block text-text font-medium mb-2" htmlFor="description">
              Mô tả
            </label>
            <textarea
              id="description"
              value={description[activeLang]}
              onChange={(e) => updateDescription(activeLang, e.target.value)}
              rows={3}
              className="w-full rounded-xl border border-primary/40 bg-white px-4 py-3 text-text focus:outline-none focus:border-primary"
            />
          </div>
        </div>
        <p className="text-text/50 text-xs mt-2">
          Nếu bỏ trống bản dịch cho một ngôn ngữ, khách xem bằng ngôn ngữ đó sẽ tự động thấy bản
          Tiếng Việt.
        </p>
      </div>

      <div>
        <p className="text-text font-medium mb-2">Loại bánh (dịp)</p>
        <ProductCategoryPicker categories={categories} value={category} onChange={setCategory} />
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <p className="text-text font-medium">Ảnh</p>
          <label className="cursor-pointer text-sm bg-primary/10 hover:bg-primary/20 text-primary-dark px-3 py-1.5 rounded-xl transition-colors">
            {bulkUploading ? 'Đang tải lên...' : '📷 Chọn nhiều ảnh cùng lúc'}
            <input
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              disabled={uploadingIndex !== null || bulkUploading}
              onChange={(e) => {
                const files = e.target.files;
                const list = files ? Array.from(files) : [];
                e.target.value = '';
                handleBulkUpload(list);
              }}
            />
          </label>
        </div>
        <div className="space-y-3">
          {images.map((img, index) => (
            <div key={index} className="flex items-start gap-3 bg-white/40 rounded-xl p-2">
              <div className="w-14 h-14 rounded-lg overflow-hidden bg-accent/20 shrink-0">
                {img && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={img} alt="" className="w-full h-full object-cover" />
                )}
              </div>
              <div className="flex-1 min-w-0 space-y-2">
                <input
                  type="text"
                  value={img}
                  onChange={(e) => updateImage(index, e.target.value)}
                  placeholder="Dán URL ảnh hoặc tải lên bên dưới"
                  className="w-full rounded-xl border border-primary/40 bg-white px-3 py-2 text-sm text-text focus:outline-none focus:border-primary"
                />
                <div className="flex items-center gap-3 text-sm">
                  <label className="cursor-pointer text-primary-dark hover:underline">
                    {uploadingIndex === index ? 'Đang tải lên...' : 'Tải ảnh từ máy'}
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      disabled={uploadingIndex !== null || bulkUploading}
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        e.target.value = '';
                        handleFileUpload(index, file);
                      }}
                    />
                  </label>
                  {images.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="text-text/60 hover:text-red-600"
                    >
                      Xoá
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
        {uploadError && <p className="text-red-600 text-sm mt-2">{uploadError}</p>}
        <button
          type="button"
          onClick={addImage}
          className="mt-2 text-sm text-primary-dark hover:underline"
        >
          + Thêm ảnh
        </button>
      </div>

      <div>
        <p className="text-text font-medium mb-2">Size, giá &amp; tình trạng</p>
        <div className="space-y-2">
          {sizes.map((size, index) => (
            <div key={index} className="bg-white/40 rounded-xl p-2 space-y-2">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={size.label}
                  onChange={(e) => updateSize(index, 'label', e.target.value)}
                  placeholder="VD: 16cm"
                  className="w-20 sm:w-32 rounded-xl border border-primary/40 bg-white px-3 sm:px-4 py-2 text-text focus:outline-none focus:border-primary"
                />
                <MoneyInput
                  value={size.price}
                  onChange={(val) => updateSize(index, 'price', val)}
                  placeholder="Giá (đ)"
                  className="flex-1 rounded-xl border border-primary/40 bg-white px-4 py-2 text-text focus:outline-none focus:border-primary"
                />
                {sizes.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeSize(index)}
                    className="px-3 text-text/60 hover:text-red-600"
                  >
                    Xoá
                  </button>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                {SIZE_STATUS_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => updateSize(index, 'status', opt.value)}
                    className={`px-3 py-1 rounded-full text-xs border transition-colors ${
                      (size.status || 'available') === opt.value
                        ? 'bg-primary text-white border-primary'
                        : 'border-primary/40 text-text hover:border-primary'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={addSize}
          className="mt-2 text-sm text-primary-dark hover:underline"
        >
          + Thêm size
        </button>
      </div>

      <div>
        <p className="text-text font-medium mb-2">Nhãn</p>
        <div className="flex gap-4">
          <label className="flex items-center gap-2 text-text">
            <input type="checkbox" checked={isHot} onChange={(e) => setIsHot(e.target.checked)} />
            Hot
          </label>
          <label className="flex items-center gap-2 text-text">
            <input type="checkbox" checked={isNew} onChange={(e) => setIsNew(e.target.checked)} />
            Mới
          </label>
        </div>
      </div>

      <div>
        <label className="flex items-center gap-2 text-text font-medium">
          <input
            type="checkbox"
            checked={isActive}
            onChange={(e) => setIsActive(e.target.checked)}
          />
          Đang bán (hiển thị cho khách)
        </label>
      </div>

      {error && <p className="text-red-600 text-sm">{error}</p>}

      <button
        type="submit"
        disabled={submitting}
        className="bg-primary hover:bg-primary-dark disabled:opacity-50 text-white px-6 py-3 rounded-xl transition-colors font-medium"
      >
        {submitting ? 'Đang lưu...' : isEdit ? 'Lưu thay đổi' : 'Thêm mẫu bánh'}
      </button>
    </form>
  );
}
