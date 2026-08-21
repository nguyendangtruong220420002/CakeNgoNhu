import Link from 'next/link';

export default function ProductCard({ product }) {
  const startingPrice = product.sizes?.length
    ? Math.min(...product.sizes.map((s) => s.price))
    : null;

  return (
    <Link
      href={`/san-pham/${product._id}`}
      className="block bg-white/60 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
    >
      <div className="aspect-square bg-accent/30 relative">
        {product.images?.[0] ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={product.images[0]}
            alt={product.name}
            loading="lazy"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-text/40 text-sm">
            Chưa có ảnh
          </div>
        )}
        {product.tags?.length > 0 && (
          <span className="absolute top-2 left-2 bg-accent text-text text-xs px-2 py-1 rounded-full">
            {product.tags[0]}
          </span>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-serif text-lg text-text mb-1">{product.name}</h3>
        {startingPrice !== null && (
          <p className="text-primary-dark font-medium">
            Từ {startingPrice.toLocaleString('vi-VN')}đ
          </p>
        )}
      </div>
    </Link>
  );
}
