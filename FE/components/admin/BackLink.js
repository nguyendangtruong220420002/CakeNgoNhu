import Link from 'next/link';

export default function BackLink({ href, label = '← Quay lại' }) {
  return (
    <Link
      href={href}
      className="inline-block text-sm font-medium text-text bg-white border border-primary/40 shadow-sm hover:border-primary hover:text-primary-dark px-3 py-2 rounded-xl transition-colors mb-4"
    >
      {label}
    </Link>
  );
}
