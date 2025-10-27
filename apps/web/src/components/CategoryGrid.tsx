'use client';

import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';

export function CategoryGrid() {
  const { data: categories, isLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: () => api.get('/categories').then((res) => res.data),
  });

  if (isLoading) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Shop by Category</h2>
          <div className="text-center">Loading categories...</div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Shop by Category</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-6">
          {categories?.map((category: any) => (
            <Link
              key={category.id}
              href={`/products?category=${category.id}`}
              className="card p-6 text-center hover:shadow-lg transition-shadow"
            >
              <div className="text-4xl mb-3">🌿</div>
              <h3 className="font-semibold text-sm">{category.name}</h3>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
