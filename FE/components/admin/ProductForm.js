'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export default function ProductForm({ initialProduct }) {
  const router = useRouter();
  const isEdit = Boolean(initialProduct);

  const [name, setName] = useState(initialProduct?.name || '');
  const [description, setDescription] = useState(initialProduct?.description || '');
  const [category, setCategory] = useState(initialProduct?.category || '');
  const [images, setImages] = useState(
    initialProduct?.images?.length ? initialProduct.images : ['']
  );
  const [sizes, setSizes] = useState(
    initialProduct?.sizes?.length ? initialProduct.sizes : [{ label: '', price: '' }]
  );
  const [isHot, setIsHot] = useState(initialProduct?.tags?.includes('Hot') || false);
  const [isNew, setIsNew] = useState(initialProduct?.tags?.includes('Mới') || false);
  const [isActive, setIsActive] = useState(initialProduct?.isActive ?? true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  function updateImage(index, value) {
    setImages((prev) => prev.map((img, i) => (i === index ? value : img)));
  }

  function addImage() {
    setImages((prev) => [...prev, '']);
  }

  function removeImage(index) {
    setImages((prev) => prev.filter((_, i) => i !== index));
  }

  function updateSize(index, field, value) {
    setSizes((prev) =>
      prev.map((size, i) => (i === index ? { ...size, [field]: value } : size))
    );
  }

  function addSize() {
    setSizes((prev) => [...prev, { label: '', price: '' }]);
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
      .map((s) => ({ label: s.label.trim(), price: Number(s.price) }));

    if (!name.trim() || !category.trim()) {
      setError('Vui lòng nhập tên và danh mục');
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
          name: name.trim(),
          description: description.trim(),
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
        <label className="block text-text font-medium mb-2" htmlFor="name">
          Tên mẫu bánh
        </label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="w-full rounded-xl border border-primary/40 bg-white px-4 py-3 text-text focus:outline-none focus:border-primary"
        />
      </div>

      <div>
        <label className="block text-text font-medium mb-2" htmlFor="description">
          Mô tả
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          className="w-full rounded-xl border border-primary/40 bg-white px-4 py-3 text-text focus:outline-none focus:border-primary"
        />
      </div>

      <div>
        <label className="block text-text font-medium mb-2" htmlFor="category">
          Danh mục (loại / dịp)
        </label>
        <input
          id="category"
          type="text"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          placeholder="VD: sinh-nhat, cuoi, kem-tuoi, fondant..."
          required
          className="w-full rounded-xl border border-primary/40 bg-white px-4 py-3 text-text focus:outline-none focus:border-primary"
        />
      </div>

      <div>
        <p className="text-text font-medium mb-2">Ảnh (URL)</p>
        <div className="space-y-2">
          {images.map((img, index) => (
            <div key={index} className="flex gap-2">
              <input
                type="text"
                value={img}
                onChange={(e) => updateImage(index, e.target.value)}
                placeholder="https://..."
                className="flex-1 rounded-xl border border-primary/40 bg-white px-4 py-2 text-text focus:outline-none focus:border-primary"
              />
              {images.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="px-3 text-text/60 hover:text-red-600"
                >
                  Xoá
                </button>
              )}
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={addImage}
          className="mt-2 text-sm text-primary-dark hover:underline"
        >
          + Thêm ảnh
        </button>
      </div>

      <div>
        <p className="text-text font-medium mb-2">Size &amp; giá</p>
        <div className="space-y-2">
          {sizes.map((size, index) => (
            <div key={index} className="flex gap-2">
              <input
                type="text"
                value={size.label}
                onChange={(e) => updateSize(index, 'label', e.target.value)}
                placeholder="VD: 16cm"
                className="w-20 sm:w-32 rounded-xl border border-primary/40 bg-white px-3 sm:px-4 py-2 text-text focus:outline-none focus:border-primary"
              />
              <input
                type="number"
                min="0"
                value={size.price}
                onChange={(e) => updateSize(index, 'price', e.target.value)}
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
