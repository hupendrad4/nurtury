'use client';

import Link from 'next/link';

export function CategoryShowcase() {
  const categories = [
    {
      name: 'Indoor Plants',
      description: 'Perfect for your home',
      count: '250+ Varieties',
      image: '🪴',
      color: 'from-emerald-500 to-teal-600',
      link: '/products?category=indoor',
    },
    {
      name: 'Outdoor Plants',
      description: 'For gardens & landscapes',
      count: '180+ Varieties',
      image: '🌳',
      color: 'from-green-500 to-emerald-600',
      link: '/products?category=outdoor',
    },
    {
      name: 'Medicinal Plants',
      description: 'Natural healing power',
      count: '80+ Varieties',
      image: '🌿',
      color: 'from-lime-500 to-green-600',
      link: '/products?medicinal=true',
    },
    {
      name: 'Flowering Plants',
      description: 'Beautiful blooms',
      count: '120+ Varieties',
      image: '🌸',
      color: 'from-pink-500 to-rose-600',
      link: '/products?category=flowering',
    },
    {
      name: 'Succulents & Cacti',
      description: 'Low maintenance',
      count: '90+ Varieties',
      image: '🌵',
      color: 'from-orange-500 to-amber-600',
      link: '/products?category=succulents',
    },
    {
      name: 'Seeds & Bulbs',
      description: 'Grow from scratch',
      count: '200+ Varieties',
      image: '🌾',
      color: 'from-yellow-500 to-orange-600',
      link: '/products?category=seeds',
    },
  ];

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Shop by Category</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Explore our curated collections of plants perfect for every space and purpose
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category, index) => (
            <Link
              key={index}
              href={category.link}
              className="group relative overflow-hidden rounded-xl bg-gradient-to-br shadow-lg hover:shadow-2xl transition-all duration-300"
              style={{ background: `linear-gradient(to bottom right, var(--tw-gradient-stops))` }}
            >
              <div className={`bg-gradient-to-br ${category.color} p-8 relative overflow-hidden`}>
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute inset-0" style={{
                    backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
                    backgroundSize: '20px 20px'
                  }} />
                </div>

                <div className="relative z-10">
                  <div className="text-6xl mb-4 group-hover:scale-110 transition-transform">
                    {category.image}
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">{category.name}</h3>
                  <p className="text-white/90 text-sm mb-3">{category.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-white/80 text-sm font-medium">{category.count}</span>
                    <span className="bg-white/20 text-white px-4 py-2 rounded-full text-sm font-medium group-hover:bg-white/30 transition-colors">
                      Explore →
                    </span>
                  </div>
                </div>

                {/* Hover Effect */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

