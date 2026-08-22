'use client';

import { useState } from 'react';
import HorizontalScroller from '@/components/HorizontalScroller';

function getPageList(current, total) {
  const delta = 1;
  const range = [];
  const withDots = [];
  let last;

  for (let i = 1; i <= total; i++) {
    if (i === 1 || i === total || (i >= current - delta && i <= current + delta)) {
      range.push(i);
    }
  }

  range.forEach((i) => {
    if (last) {
      if (i - last === 2) {
        withDots.push(last + 1);
      } else if (i - last !== 1) {
        withDots.push('...');
      }
    }
    withDots.push(i);
    last = i;
  });

  return withDots;
}

export default function Pagination({
  total,
  page,
  pageSize,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [10, 20, 50, 100],
  itemLabel = 'mục',
}) {
  const [jumpValue, setJumpValue] = useState('');
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  if (total === 0) return null;

  const start = (page - 1) * pageSize + 1;
  const end = Math.min(total, page * pageSize);
  const pages = getPageList(page, totalPages);

  function handleJump(e) {
    e.preventDefault();
    const n = parseInt(jumpValue, 10);
    if (n >= 1 && n <= totalPages) {
      onPageChange(n);
    }
    setJumpValue('');
  }

  return (
    <HorizontalScroller className="flex flex-nowrap items-center gap-1 mt-3 text-xs text-text/70 overflow-x-auto pb-1 -mx-4 px-4 sm:mx-0 sm:px-0 sm:justify-end">
      <span className="shrink-0 whitespace-nowrap">
        {start}-{end} trên {total} {itemLabel}
      </span>

      <button
        type="button"
        disabled={page <= 1}
        onClick={() => onPageChange(page - 1)}
        aria-label="Trang trước"
        className="shrink-0 w-5 h-5 rounded-md border border-primary/30 text-text disabled:opacity-30 disabled:cursor-not-allowed hover:border-primary flex items-center justify-center transition-colors"
      >
        <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      {pages.map((p, idx) =>
        p === '...' ? (
          <span key={`dots-${idx}`} className="shrink-0 px-0.5 text-text/40">
            …
          </span>
        ) : (
          <button
            key={p}
            type="button"
            onClick={() => onPageChange(p)}
            className={`shrink-0 w-5 h-5 rounded-md text-xs border transition-colors ${
              p === page
                ? 'border-primary text-primary font-medium bg-primary/10'
                : 'border-transparent hover:border-primary/30'
            }`}
          >
            {p}
          </button>
        )
      )}

      <button
        type="button"
        disabled={page >= totalPages}
        onClick={() => onPageChange(page + 1)}
        aria-label="Trang sau"
        className="shrink-0 w-5 h-5 rounded-md border border-primary/30 text-text disabled:opacity-30 disabled:cursor-not-allowed hover:border-primary flex items-center justify-center transition-colors"
      >
        <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {onPageSizeChange && (
        <select
          value={pageSize}
          onChange={(e) => onPageSizeChange(Number(e.target.value))}
          className="shrink-0 rounded-md border border-primary/30 bg-white px-1 py-0.5 text-xs text-text focus:outline-none focus:border-primary"
        >
          {pageSizeOptions.map((n) => (
            <option key={n} value={n}>
              {n} / trang
            </option>
          ))}
        </select>
      )}

      <form onSubmit={handleJump} className="shrink-0 flex items-center gap-1">
        <span className="whitespace-nowrap">Đến trang</span>
        <input
          type="number"
          min={1}
          max={totalPages}
          value={jumpValue}
          onChange={(e) => setJumpValue(e.target.value)}
          className="w-10 rounded-md border border-primary/30 bg-white px-1 py-0.5 text-xs text-text focus:outline-none focus:border-primary"
        />
      </form>
    </HorizontalScroller>
  );
}
