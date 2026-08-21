import { notFound } from 'next/navigation';
import { getProductById } from '@/lib/api';
import ImageGallery from '@/components/ImageGallery';
import ProductOrderPanel from '@/components/ProductOrderPanel';

export default async function ProductDetailPage({ params }) {
  const { id } = await params;
  const product = await getProductById(id);

  if (!product) {
    notFound();
  }

  return (
    <main className="min-h-screen px-4 py-8 md:py-12 max-w-5xl mx-auto pb-24 md:pb-12">
      <div className="grid md:grid-cols-2 gap-8 md:gap-12">
        <ImageGallery images={product.images} alt={product.name} />

        <div>
          {product.tags?.length > 0 && (
            <div className="flex gap-2 mb-3">
              {product.tags.map((tag) => (
                <span key={tag} className="bg-accent text-text text-xs px-2 py-1 rounded-full">
                  {tag}
                </span>
              ))}
            </div>
          )}
          <h1 className="font-serif text-2xl md:text-3xl text-text mb-3">{product.name}</h1>
          {product.description && (
            <p className="text-text/70 mb-6 whitespace-pre-line">{product.description}</p>
          )}

          <ProductOrderPanel product={product} />
        </div>
      </div>
    </main>
  );
}
