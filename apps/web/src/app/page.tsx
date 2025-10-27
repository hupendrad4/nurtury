import { HeroSection } from '@/components/HeroSection';
import { FeaturedProducts } from '@/components/FeaturedProducts';
import { BannerCarousel } from '@/components/BannerCarousel';
import { CategoryShowcase } from '@/components/CategoryShowcase';
import { PlantCareSection } from '@/components/PlantCareSection';
import { TestimonialsSection } from '@/components/TestimonialsSection';
import { NewsletterSection } from '@/components/NewsletterSection';
import { TrustBadges } from '@/components/TrustBadges';

export default function HomePage() {
  return (
    <div className="bg-gray-50">
      <HeroSection />
      <BannerCarousel />

      {/* Trust Badges */}
      <TrustBadges />

      {/* Category Showcase */}
      <CategoryShowcase />

      {/* Featured Products */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Trending Plants</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Discover our most popular plants loved by gardeners across India
            </p>
          </div>
          <FeaturedProducts />
        </div>
      </section>

      {/* Medicinal Plants Special Section */}
      <section className="py-16 bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <span className="inline-block bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-semibold mb-4">
              ✨ SPECIAL COLLECTION
            </span>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Medicinal & Ayurvedic Plants</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Bring the power of traditional medicine to your home with our authentic medicinal plant collection
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div className="bg-white rounded-xl p-8 text-center shadow-lg hover:shadow-xl transition-shadow">
              <div className="text-6xl mb-4">🌿</div>
              <h3 className="text-xl font-semibold mb-3">Aloe Vera</h3>
              <p className="text-gray-600 mb-4">Natural healing for skin, hair, and digestive health</p>
              <div className="flex items-center justify-center gap-2 text-sm text-gray-500 mb-4">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span>4.8 (250 reviews)</span>
              </div>
              <a href="/products?medicinal=true" className="btn-primary w-full">
                Shop Now
              </a>
            </div>
            <div className="bg-white rounded-xl p-8 text-center shadow-lg hover:shadow-xl transition-shadow">
              <div className="text-6xl mb-4">🍃</div>
              <h3 className="text-xl font-semibold mb-3">Tulsi (Holy Basil)</h3>
              <p className="text-gray-600 mb-4">Immunity booster and natural stress reliever</p>
              <div className="flex items-center justify-center gap-2 text-sm text-gray-500 mb-4">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span>4.9 (320 reviews)</span>
              </div>
              <a href="/products?medicinal=true" className="btn-primary w-full">
                Shop Now
              </a>
            </div>
            <div className="bg-white rounded-xl p-8 text-center shadow-lg hover:shadow-xl transition-shadow">
              <div className="text-6xl mb-4">🌱</div>
              <h3 className="text-xl font-semibold mb-3">Neem Plant</h3>
              <p className="text-gray-600 mb-4">Antibacterial and antifungal properties</p>
              <div className="flex items-center justify-center gap-2 text-sm text-gray-500 mb-4">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span>4.7 (180 reviews)</span>
              </div>
              <a href="/products?medicinal=true" className="btn-primary w-full">
                Shop Now
              </a>
            </div>
          </div>
          <div className="text-center">
            <a href="/products?medicinal=true" className="inline-flex items-center text-primary font-semibold hover:text-primary-dark">
              View All Medicinal Plants
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
          </div>
        </div>
      </section>

      {/* Plant Care Section */}
      <PlantCareSection />

      {/* Testimonials */}
      <TestimonialsSection />

      {/* Why Choose Us */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose QuoriumAgro?</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              We're committed to bringing nature closer to you with premium quality plants
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">100% Quality Guaranteed</h3>
              <p className="text-gray-600">Every plant is carefully inspected before shipping</p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Fast & Safe Delivery</h3>
              <p className="text-gray-600">Ships within 2-3 days with secure packaging</p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Expert Care Support</h3>
              <p className="text-gray-600">Free lifetime plant care guidance from experts</p>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <NewsletterSection />
    </div>
  );
}
