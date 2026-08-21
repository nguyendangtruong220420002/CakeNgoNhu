'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

export default function DateRangeFilter({ basePath, from, to, isAll }) {
  const router = useRouter();
  const [fromDate, setFromDate] = useState(from || todayStr());
  const [toDate, setToDate] = useState(to || todayStr());

  function applyRange(e) {
    e.preventDefault();
    router.push(`${basePath}?from=${fromDate}&to=${toDate}`);
  }

  function viewToday() {
    const t = todayStr();
    setFromDate(t);
    setToDate(t);
    router.push(`${basePath}?from=${t}&to=${t}`);
  }

  function viewAll() {
    router.push(`${basePath}?all=1`);
  }

  function handleReset() {
    const t = todayStr();
    setFromDate(t);
    setToDate(t);
    router.push(basePath);
  }

  const isToday = !isAll && from === todayStr() && to === todayStr();

  return (
    <form onSubmit={applyRange} className="flex flex-wrap items-end gap-3 mb-6">
      <div>
        <label className="block text-text font-medium mb-1 text-sm" htmlFor="from">
          Từ ngày
        </label>
        <input
          id="from"
          type="date"
          value={fromDate}
          onChange={(e) => setFromDate(e.target.value)}
          className="rounded-xl border border-primary/40 bg-white px-3 py-2 text-sm text-text focus:outline-none focus:border-primary"
        />
      </div>
      <div>
        <label className="block text-text font-medium mb-1 text-sm" htmlFor="to">
          Đến ngày
        </label>
        <input
          id="to"
          type="date"
          value={toDate}
          onChange={(e) => setToDate(e.target.value)}
          className="rounded-xl border border-primary/40 bg-white px-3 py-2 text-sm text-text focus:outline-none focus:border-primary"
        />
      </div>
      <button
        type="submit"
        className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors"
      >
        Lọc
      </button>
      <button
        type="button"
        onClick={viewToday}
        className={`px-4 py-2 rounded-xl border text-sm transition-colors ${
          isToday
            ? 'bg-primary text-white border-primary'
            : 'border-primary/40 text-text hover:border-primary'
        }`}
      >
        Hôm nay
      </button>
      <button
        type="button"
        onClick={viewAll}
        className={`px-4 py-2 rounded-xl border text-sm transition-colors ${
          isAll
            ? 'bg-primary text-white border-primary'
            : 'border-primary/40 text-text hover:border-primary'
        }`}
      >
        Tất cả
      </button>
      <button
        type="button"
        onClick={handleReset}
        className="px-4 py-2 rounded-xl border border-text/20 text-text/60 hover:text-text hover:border-text/40 text-sm transition-colors"
      >
        Đặt lại
      </button>
    </form>
  );
}
