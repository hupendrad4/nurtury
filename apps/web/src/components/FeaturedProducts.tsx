'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';

export function FeaturedProducts() {
  const { data: products, isLoading } = useQuery({
    queryKey: ['featured-products'],
    queryFn: () => api.get('/products?limit=8&sortBy=rating').then((res) => res.data),
  });

  if (isLoading) {
    return (
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Featured Products</h2>
            <p className="text-text-light text-lg">Our most popular and highly-rated items</p>
          </div>
          <div className="text-center">Loading featured products...</div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Featured Products</h2>
          <p className="text-text-light text-lg max-w-2xl mx-auto">
            Discover our most popular plants, tools, and gardening essentials loved by thousands of customers
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {products?.data?.map((product: any) => {
            const images = JSON.parse(product.images || '[]');
            return (
              <Link
                key={product.id}
                href={`/products/${product.slug}`}
                className="card hover:shadow-xl transition-all duration-300 group overflow-hidden"
              >
                <div className="relative h-64 overflow-hidden">
                  <Image
                    src={images[0]?.url || '/placeholder.png'}
                    alt={product.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  {product.compareAtPrice && (
                    <div className="absolute top-3 right-3 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                      {Math.round(((product.compareAtPrice - product.basePrice) / product.compareAtPrice) * 100)}% OFF
                    </div>
                  )}
                  {product.isMedicinal && (
                    <div className="absolute top-3 left-3 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                      Medicinal
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                </div>
                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                      {product.category?.name}
                    </span>
                    <div className="flex items-center">
                      <span className="text-yellow-500 text-sm">★</span>
                      <span className="text-sm ml-1 font-medium">{product.rating}</span>
                    </div>
                  </div>
                  <h3 className="font-semibold mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                    {product.name}
                  </h3>
                  <p className="text-sm text-text-light mb-3 line-clamp-2">
                    {product.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <span className="text-primary font-bold text-lg">₹{product.basePrice}</span>
                      {product.compareAtPrice && (
                        <span className="text-gray-400 line-through text-sm ml-2">
                          ₹{product.compareAtPrice}
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-text-light">
                      {product.reviewCount} reviews
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        <div className="text-center">
          <Link
            href="/products"
            className="btn-primary"
          >
            View All Products →
          </Link>
        </div>
      </div>
    </section>
  );
}
