'use client';

import Link from 'next/link';
import Image from 'next/image';

export function PlantCareSection() {
  const careGuides = [
    {
      title: 'Watering Guide',
      description: 'Learn the perfect watering schedule for your plants',
      icon: '💧',
      link: '/guides/watering',
    },
    {
      title: 'Sunlight Tips',
      description: 'Understand light requirements for different plants',
      icon: '☀️',
      link: '/guides/sunlight',
    },
    {
      title: 'Soil & Fertilizer',
      description: 'Choose the right soil and nutrients',
      icon: '🌱',
      link: '/guides/soil',
    },
    {
      title: 'Pest Control',
      description: 'Natural solutions for common plant pests',
      icon: '🐛',
      link: '/guides/pests',
    },
  ];

  return (
    <section className="py-16 bg-gradient-to-b from-white to-green-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Plant Care Made Easy</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Expert guidance to help your plants thrive. Learn essential care tips from our gardening specialists.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {careGuides.map((guide, index) => (
            <Link
              key={index}
              href={guide.link}
              className="card p-6 hover:shadow-xl transition-all duration-300 group bg-white border-2 border-transparent hover:border-primary"
            >
              <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">{guide.icon}</div>
              <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                {guide.title}
              </h3>
              <p className="text-gray-600 text-sm mb-4">{guide.description}</p>
              <span className="text-primary font-medium text-sm flex items-center">
                Learn More
                <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </span>
            </Link>
          ))}
        </div>

        {/* Video Tutorial Section */}
        <div className="bg-white rounded-xl overflow-hidden shadow-lg">
          <div className="grid md:grid-cols-2 gap-0">
            <div className="relative h-64 md:h-auto bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center">
              <div className="text-center text-white">
                <svg className="w-24 h-24 mx-auto mb-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" />
                </svg>
                <p className="text-sm font-medium">Watch Video Guide</p>
              </div>
            </div>
            <div className="p-8 flex flex-col justify-center">
              <h3 className="text-2xl font-bold mb-3">Complete Plant Care Video Course</h3>
              <p className="text-gray-600 mb-6">
                Watch our comprehensive video series covering everything from basic plant care to advanced gardening techniques.
              </p>
              <div className="flex items-center gap-4 text-sm text-gray-600 mb-6">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>25+ Videos</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  <span>HD Quality</span>
                </div>
              </div>
              <button className="btn-primary w-full md:w-auto">
                Start Learning Free
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

