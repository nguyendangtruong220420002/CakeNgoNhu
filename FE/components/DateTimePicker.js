'use client';

import { useEffect, useRef, useState } from 'react';

const WEEKDAYS = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];
const MONTH_NAMES = [
  'Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6',
  'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12',
];
const HOURS = Array.from({ length: 24 }, (_, i) => i);
const MINUTES = [0, 15, 30, 45];

function pad(n) {
  return String(n).padStart(2, '0');
}

// Luôn lấy "bây giờ" theo giờ Việt Nam (UTC+7), không lệ thuộc múi giờ máy khách
export function vnNow() {
  return new Date(new Date().toLocaleString('en-US', { timeZone: 'Asia/Ho_Chi_Minh' }));
}

function toValue(year, month, day, hour, minute, mode) {
  const datePart = `${year}-${pad(month + 1)}-${pad(day)}`;
  return mode === 'date' ? datePart : `${datePart}T${pad(hour)}:${pad(minute)}`;
}

export function parseValue(value) {
  if (!value) return null;
  const [datePart, timePart] = value.split('T');
  const [y, m, d] = (datePart || '').split('-').map(Number);
  const [h, mi] = (timePart || '00:00').split(':').map(Number);
  if (!y || !m || !d) return null;
  return { year: y, month: m - 1, day: d, hour: h || 0, minute: mi || 0 };
}

// Chuyển giá trị đã chọn (giờ Việt Nam, UTC+7) sang ISO string UTC chuẩn để gửi lên server,
// không phụ thuộc múi giờ của trình duyệt khách
export function vnValueToISOString(value) {
  const parsed = parseValue(value);
  if (!parsed) return null;
  const utcMs = Date.UTC(parsed.year, parsed.month, parsed.day, parsed.hour - 7, parsed.minute);
  return new Date(utcMs).toISOString();
}

export default function DateTimePicker({ id, value, onChange, min, mode = 'datetime', placeholder, compact = false }) {
  const isDateOnly = mode === 'date';
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);

  const parsed = parseValue(value);
  const minParsed = parseValue(min);

  const [viewYear, setViewYear] = useState(parsed?.year || minParsed?.year || vnNow().getFullYear());
  const [viewMonth, setViewMonth] = useState(parsed?.month ?? minParsed?.month ?? vnNow().getMonth());

  useEffect(() => {
    function handleClickOutside(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) setOpen(false);
    }
    if (open) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  function shiftMonth(delta) {
    let m = viewMonth + delta;
    let y = viewYear;
    if (m < 0) {
      m = 11;
      y -= 1;
    } else if (m > 11) {
      m = 0;
      y += 1;
    }
    setViewMonth(m);
    setViewYear(y);
  }

  function isBeforeMin(y, m, d) {
    if (!minParsed) return false;
    const a = new Date(y, m, d).setHours(0, 0, 0, 0);
    const b = new Date(minParsed.year, minParsed.month, minParsed.day).setHours(0, 0, 0, 0);
    return a < b;
  }

  function handleSelectDate(day) {
    const h = parsed?.hour ?? 9;
    const mi = parsed?.minute ?? 0;
    onChange(toValue(viewYear, viewMonth, day, h, mi, mode));
    if (isDateOnly) setOpen(false);
  }

  function handleTimeChange(hour, minute) {
    const base = parsed || { year: viewYear, month: viewMonth, day: vnNow().getDate() };
    onChange(toValue(base.year, base.month, base.day, hour, minute, mode));
  }

  const selectedHour = parsed?.hour ?? 9;
  const selectedMinute = parsed?.minute ?? 0;

  const firstDay = new Date(viewYear, viewMonth, 1);
  const startWeekday = (firstDay.getDay() + 6) % 7; // Thứ 2 = 0
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const cells = [];
  for (let i = 0; i < startWeekday; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  const displayLabel = parsed
    ? isDateOnly
      ? `${pad(parsed.day)}/${pad(parsed.month + 1)}/${parsed.year}`
      : `${pad(parsed.day)}/${pad(parsed.month + 1)}/${parsed.year} — ${pad(parsed.hour)}:${pad(parsed.minute)}`
    : '';

  const emptyLabel = placeholder || (isDateOnly ? 'Chọn ngày' : 'Chọn ngày giờ');

  return (
    <div ref={containerRef} className="relative">
      <button
        id={id}
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={
          compact
            ? 'w-full flex items-center justify-between gap-1.5 rounded-lg border border-primary/40 bg-white px-2 py-1.5 text-left text-text text-sm focus:outline-none focus:border-primary transition-colors'
            : 'w-full flex items-center justify-between gap-2 rounded-xl border border-primary/40 bg-white/60 px-4 py-3 text-left text-text focus:outline-none focus:border-primary transition-colors'
        }
      >
        <span className={displayLabel ? 'truncate' : 'truncate text-text/40'}>{displayLabel || emptyLabel}</span>
        <svg
          className={`${compact ? 'h-4 w-4' : 'h-5 w-5'} text-primary shrink-0`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <rect x="4" y="5" width="16" height="15" rx="2" strokeWidth={2} />
          <path strokeLinecap="round" strokeWidth={2} d="M4 9h16M8 3v3M16 3v3" />
        </svg>
      </button>

      {open && (
        <div className="absolute z-30 mt-2 left-0 right-0 bg-white rounded-2xl border border-primary/20 shadow-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <button
              type="button"
              onClick={() => shiftMonth(-1)}
              className="w-8 h-8 rounded-lg hover:bg-accent/20 flex items-center justify-center text-text"
            >
              ‹
            </button>
            <span className="font-medium text-text">
              {MONTH_NAMES[viewMonth]} {viewYear}
            </span>
            <button
              type="button"
              onClick={() => shiftMonth(1)}
              className="w-8 h-8 rounded-lg hover:bg-accent/20 flex items-center justify-center text-text"
            >
              ›
            </button>
          </div>

          <div className="grid grid-cols-7 gap-1 text-center text-xs text-text/50 mb-1">
            {WEEKDAYS.map((w) => (
              <div key={w}>{w}</div>
            ))}
          </div>

          <div className={`grid grid-cols-7 gap-1 ${isDateOnly ? '' : 'mb-4'}`}>
            {cells.map((day, i) => {
              if (day === null) return <div key={`empty-${i}`} />;
              if (isBeforeMin(viewYear, viewMonth, day)) return <div key={day} />;
              const isSelected =
                parsed && parsed.year === viewYear && parsed.month === viewMonth && parsed.day === day;
              return (
                <button
                  key={day}
                  type="button"
                  onClick={() => handleSelectDate(day)}
                  className={`h-8 w-8 mx-auto rounded-lg text-sm flex items-center justify-center transition-colors ${
                    isSelected ? 'bg-primary text-white font-medium' : 'text-text hover:bg-accent/30'
                  }`}
                >
                  {day}
                </button>
              );
            })}
          </div>

          {!isDateOnly && (
            <>
              <div className="flex items-center gap-2 pt-3 border-t border-primary/10">
                <span className="text-text/60 text-sm shrink-0">Giờ nhận</span>
                <select
                  value={selectedHour}
                  onChange={(e) => handleTimeChange(Number(e.target.value), selectedMinute)}
                  className="flex-1 rounded-lg border border-primary/30 bg-white px-2 py-1.5 text-sm text-text focus:outline-none focus:border-primary"
                >
                  {HOURS.map((h) => (
                    <option key={h} value={h}>
                      {pad(h)} giờ
                    </option>
                  ))}
                </select>
                <select
                  value={selectedMinute}
                  onChange={(e) => handleTimeChange(selectedHour, Number(e.target.value))}
                  className="flex-1 rounded-lg border border-primary/30 bg-white px-2 py-1.5 text-sm text-text focus:outline-none focus:border-primary"
                >
                  {MINUTES.map((m) => (
                    <option key={m} value={m}>
                      {pad(m)} phút
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="button"
                onClick={() => setOpen(false)}
                disabled={!parsed}
                className="w-full mt-3 bg-primary hover:bg-primary-dark disabled:opacity-50 text-white rounded-xl py-2.5 text-sm font-medium transition-colors"
              >
                Xong
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
