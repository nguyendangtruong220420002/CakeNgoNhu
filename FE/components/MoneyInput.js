'use client';

export default function MoneyInput({ id, value, onChange, placeholder, className, required }) {
  function handleChange(e) {
    const digits = e.target.value.replace(/\D/g, '');
    onChange(digits === '' ? '' : Number(digits));
  }

  const displayValue = value === '' || value === undefined || value === null
    ? ''
    : Number(value).toLocaleString('vi-VN');

  return (
    <input
      id={id}
      type="text"
      inputMode="numeric"
      value={displayValue}
      onChange={handleChange}
      placeholder={placeholder}
      required={required}
      className={className}
    />
  );
}
