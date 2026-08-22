import Image from 'next/image';

const ASPECT_RATIO = 239 / 70;

export default function Logo({ size = 56, className = '' }) {
  const height = size;
  const width = Math.round(size * ASPECT_RATIO);

  return (
    <Image
      src="/images/logo.png"
      alt="Ngô Như Cake Studio"
      width={width}
      height={height}
      priority
      className={`object-contain shrink-0 ${className}`}
    />
  );
}
