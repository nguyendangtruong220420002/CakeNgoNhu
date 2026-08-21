export default function Logo({ size = 56, className = '' }) {
  return (
    <div
      style={{ width: size, height: size }}
      className={`inline-flex flex-col items-center justify-center rounded-full border-2 border-primary bg-accent/20 shrink-0 ${className}`}
    >
      <span
        className="font-serif font-bold text-primary leading-none text-center"
        style={{ fontSize: size * 0.16 }}
      >
        NGÔ NHƯ
      </span>
      <span
        className="text-primary-dark leading-none tracking-wider text-center mt-0.5"
        style={{ fontSize: size * 0.09 }}
      >
        · CAKE STUDIO ·
      </span>
    </div>
  );
}
