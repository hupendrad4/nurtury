'use client';

import { useState } from 'react';

export function TestimonialsSection() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const testimonials = [
    {
      name: 'Priya Sharma',
      location: 'Mumbai, Maharashtra',
      rating: 5,
      text: 'Excellent quality plants! The packaging was perfect and all plants arrived healthy. Customer service is outstanding. Highly recommend for anyone looking to start their garden.',
      image: '👩',
      verified: true,
    },
    {
      name: 'Rajesh Kumar',
      location: 'Bangalore, Karnataka',
      rating: 5,
      text: 'I ordered medicinal plants and they are thriving! The care instructions provided were very helpful. Will definitely order again.',
      image: '👨',
      verified: true,
    },
    {
      name: 'Anjali Patel',
      location: 'Ahmedabad, Gujarat',
      rating: 5,
      text: 'Best online nursery! Fast delivery, healthy plants, and great prices. The variety of plants available is impressive.',
      image: '👩',
      verified: true,
    },
    {
      name: 'Vikram Singh',
      location: 'Delhi NCR',
      rating: 5,
      text: 'Amazing experience! The plants came well-packed and the quality exceeded my expectations. The team is very knowledgeable.',
      image: '👨',
      verified: true,
    },
  ];

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <section className="py-16 bg-gradient-to-b from-green-50 to-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">What Our Customers Say</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Join thousands of happy plant parents who trust us for their gardening needs
          </p>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          <div className="text-center">
            <div className="text-4xl font-bold text-primary mb-2">50,000+</div>
            <div className="text-gray-600 text-sm">Happy Customers</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-primary mb-2">4.8★</div>
            <div className="text-gray-600 text-sm">Average Rating</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-primary mb-2">1000+</div>
            <div className="text-gray-600 text-sm">Plant Varieties</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-primary mb-2">98%</div>
            <div className="text-gray-600 text-sm">Survival Rate</div>
          </div>
        </div>

        {/* Testimonial Carousel */}
        <div className="relative max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
            <div className="flex items-start gap-6">
              <div className="text-6xl flex-shrink-0">
                {testimonials[currentIndex].image}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-3">
                  {[...Array(testimonials[currentIndex].rating)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                  {testimonials[currentIndex].verified && (
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium ml-2">
                      ✓ Verified Purchase
                    </span>
                  )}
                </div>
                <p className="text-gray-700 text-lg mb-6 leading-relaxed">
                  "{testimonials[currentIndex].text}"
                </p>
                <div>
                  <div className="font-semibold text-gray-900">{testimonials[currentIndex].name}</div>
                  <div className="text-sm text-gray-500">{testimonials[currentIndex].location}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Buttons */}
          <button
            onClick={prevTestimonial}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-white rounded-full p-3 shadow-lg hover:bg-gray-50 transition-colors"
          >
            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={nextTestimonial}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 bg-white rounded-full p-3 shadow-lg hover:bg-gray-50 transition-colors"
          >
            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Dots Indicator */}
          <div className="flex justify-center gap-2 mt-6">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === currentIndex ? 'bg-primary w-8' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

