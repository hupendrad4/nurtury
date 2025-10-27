'use client';

import { useQuery } from '@tanstack/react-query';
import Image from 'next/image';
import { api } from '@/lib/api';

export function BannerCarousel() {
  const { data: banners } = useQuery({
    queryKey: ['banners'],
    queryFn: () => api.get('/banners').then((res) => res.data),
  });

  if (!banners || banners.length === 0) return null;

  return (
    <section className="py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {banners.slice(0, 3).map((banner: any) => (
            <div key={banner.id} className="relative h-48 rounded-lg overflow-hidden shadow-md">
              <Image
                src={banner.image}
                alt={banner.title}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
                <div className="p-4 text-white">
                  <h3 className="font-bold text-lg">{banner.title}</h3>
                  <p className="text-sm opacity-90">{banner.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
