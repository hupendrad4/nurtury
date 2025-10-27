import Link from 'next/link';

export function HeroSection() {
  return (
    <section className="bg-gradient-to-br from-primary via-primary-light to-green-600 text-white py-20 lg:py-32">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-6">
            <span className="text-6xl">🌱</span>
          </div>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
            Welcome to
            <span className="block text-yellow-300">QuoriumAgro</span>
          </h1>
          <p className="text-xl md:text-2xl lg:text-3xl mb-4 opacity-90 font-light">
            We Grow Roots Together
          </p>
          <p className="text-lg md:text-xl mb-10 opacity-80 max-w-2xl mx-auto leading-relaxed">
            Discover nature's finest collection of ornamental plants, medicinal herbs, fresh seeds,
            premium fertilizers, and essential gardening tools. Transform your space into a thriving green paradise.
          </p>

          {/* Feature highlights */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10 max-w-3xl mx-auto">
            <div className="flex flex-col items-center p-4 bg-white/10 rounded-lg backdrop-blur-sm">
              <span className="text-3xl mb-2">🌿</span>
              <span className="font-semibold">Premium Quality</span>
              <span className="text-sm opacity-80">Hand-picked plants</span>
            </div>
            <div className="flex flex-col items-center p-4 bg-white/10 rounded-lg backdrop-blur-sm">
              <span className="text-3xl mb-2">🚚</span>
              <span className="font-semibold">Fast Delivery</span>
              <span className="text-sm opacity-80">Island-wide shipping</span>
            </div>
            <div className="flex flex-col items-center p-4 bg-white/10 rounded-lg backdrop-blur-sm">
              <span className="text-3xl mb-2">💚</span>
              <span className="font-semibold">Expert Care</span>
              <span className="text-sm opacity-80">Plant care guidance</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/products"
              className="bg-yellow-400 text-primary hover:bg-yellow-300 font-bold py-4 px-8 rounded-full text-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              🛒 Shop Our Collection
            </Link>
            <Link
              href="/products?category=ornamental-plants"
              className="border-2 border-white text-white hover:bg-white hover:text-primary font-semibold py-4 px-8 rounded-full text-lg transition-all duration-300"
            >
              🌸 Browse Plants
            </Link>
            <Link
              href="/products?category=gardening-tools"
              className="border-2 border-white text-white hover:bg-white hover:text-primary font-semibold py-4 px-8 rounded-full text-lg transition-all duration-300"
            >
              🔧 Garden Tools
            </Link>
          </div>

          {/* Trust indicators */}
          <div className="mt-12 pt-8 border-t border-white/20">
            <p className="text-sm opacity-70 mb-4">Trusted by 10,000+ gardeners</p>
            <div className="flex justify-center items-center space-x-8 text-sm opacity-60">
              <span>✓ Free Shipping over ₹500</span>
              <span>✓ 30-day Returns</span>
              <span>✓ Expert Plant Care Support</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
