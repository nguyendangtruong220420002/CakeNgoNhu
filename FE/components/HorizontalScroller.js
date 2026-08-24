'use client';

import { useEffect, useRef, useState } from 'react';

export default function HorizontalScroller({ children, className = '' }) {
  const ref = useRef(null);
  const drag = useRef({ active: false, startX: 0, startScrollLeft: 0, moved: false });
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [dragging, setDragging] = useState(false);

  function updateArrows() {
    const el = ref.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 4);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  }

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    updateArrows();
    // ResizeObserver bắt luôn các thay đổi kích thước do ảnh/font load xong sau khi mount,
    // tránh trường hợp scrollWidth đo lúc content chưa ổn định làm nút </> lúc ẩn lúc hiện sai.
    const observer = new ResizeObserver(() => updateArrows());
    observer.observe(el);
    for (const child of el.children) observer.observe(child);
    window.addEventListener('resize', updateArrows);
    return () => {
      observer.disconnect();
      window.removeEventListener('resize', updateArrows);
    };
  }, [children]);

  function scrollByAmount(dir) {
    const el = ref.current;
    if (!el) return;
    el.scrollBy({ left: dir * el.clientWidth * 0.6, behavior: 'smooth' });
  }

  function onPointerDown(e) {
    const el = ref.current;
    if (!el) return;
    // Luôn reset "moved" cho tương tác mới, tránh lần vuốt trước làm chặn nhầm cú bấm nút sau đó
    drag.current.moved = false;
    if (e.target.closest('input, select, textarea, button, a, [contenteditable="true"]')) return;
    // Ngón tay/bút cảm ứng để trình duyệt tự xử lý cuộn ngang gốc (mượt hơn, có quán tính) —
    // chỉ tự bắt kéo bằng JS cho chuột, vì chuột không có cử chỉ vuốt-cuộn sẵn có.
    if (e.pointerType !== 'mouse') return;
    drag.current = {
      active: true,
      startX: e.clientX,
      startScrollLeft: el.scrollLeft,
      moved: false,
    };
    el.setPointerCapture(e.pointerId);
    setDragging(true);
  }

  function onPointerMove(e) {
    const el = ref.current;
    if (!el || !drag.current.active) return;
    const delta = e.clientX - drag.current.startX;
    if (Math.abs(delta) > 3) drag.current.moved = true;
    el.scrollLeft = drag.current.startScrollLeft - delta;
  }

  function onPointerUp(e) {
    const el = ref.current;
    if (!el) return;
    drag.current.active = false;
    el.releasePointerCapture(e.pointerId);
    setDragging(false);
  }

  function onClickCapture(e) {
    if (drag.current.moved) {
      e.preventDefault();
      e.stopPropagation();
    }
  }

  return (
    <div className="relative">
      {canScrollLeft && (
        <button
          type="button"
          onClick={() => scrollByAmount(-1)}
          aria-label="Cuộn sang trái"
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-7 h-7 rounded-full bg-white/80 backdrop-blur-sm border border-primary/40 text-primary shadow-md flex items-center justify-center sm:hidden"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      )}

      <div
        ref={ref}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onClickCapture={onClickCapture}
        onScroll={updateArrows}
        className={`cursor-grab active:cursor-grabbing ${dragging ? 'select-none' : ''} ${className}`}
      >
        {children}
      </div>

      {canScrollRight && (
        <button
          type="button"
          onClick={() => scrollByAmount(1)}
          aria-label="Cuộn sang phải"
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-7 h-7 rounded-full bg-white/80 backdrop-blur-sm border border-primary/40 text-primary shadow-md flex items-center justify-center sm:hidden"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      )}
    </div>
  );
}
