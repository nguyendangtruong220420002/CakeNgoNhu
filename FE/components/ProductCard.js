import Link from "next/link";
import { t } from "@/lib/i18n/getDictionary";
import { pickLocalized } from "@/lib/i18n/localizedText";

export default function ProductCard({ product, locale }) {
  const startingPrice = product.sizes?.length
    ? Math.min(...product.sizes.map((s) => s.price))
    : null;
  const name = pickLocalized(product.name, locale);

  return (
    <Link
      href={`/san-pham/${product._id}`}
      className="flex flex-col h-full bg-white/60 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow p-1"
    >
      <div className="aspect-square bg-accent/30 relative rounded-t-xl overflow-hidden">
        {product.images?.[0] ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={product.images[0]}
            alt={name}
            loading="lazy"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-text/40 text-sm">
            {t(locale, "product.noImage")}
          </div>
        )}
        {product.tags?.length > 0 && (
          <span className="absolute top-2 left-2 bg-accent text-text text-xs px-2 py-1 rounded-full">
            {product.tags[0]}
          </span>
        )}
      </div>
      <div className="p-4 text-center flex-1 flex flex-col justify-center">
        <h3 className="font-serif text-sm md:text-base text-text mb-0">
          {name}
        </h3>
        {startingPrice !== null && (
          <p className="text-primary-dark font-medium text-sm">
            {t(locale, "product.from")} {startingPrice.toLocaleString("vi-VN")}đ
          </p>
        )}
      </div>
    </Link>
  );
}
