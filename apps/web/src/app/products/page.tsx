'use client';

import { useEffect, useMemo, useState } from 'react';
import { ProductCard } from '@/components/ProductCard';
import { Search } from 'lucide-react';
import { mockProducts, type Product } from '@/data/mockProducts';

type Filters = {
  isMedicinal?: boolean;
  isOrganic?: boolean;
  category?: string;
  searchQuery?: string;
  sortBy?: string;
};

export default function ProductsPage() {
  const [filters, setFilters] = useState<Filters>({
    searchQuery: '',
    sortBy: 'featured',
    isMedicinal: false,
    isOrganic: false,
    category: ''
  });
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Extract unique categories from products
  const categories = useMemo(() => {
    const categorySet = new Set<string>();
    mockProducts.forEach(product => categorySet.add(product.category));
    return Array.from(categorySet).map(category => ({
      id: category.toLowerCase().replace(/\s+/g, '-'),
      name: category
    }));
  }, []);

  // Filter and sort products based on filters
  useEffect(() => {
    setIsLoading(true);
    
    let result = [...mockProducts];
    
    // Apply search filter
    if (filters.searchQuery) {
      const searchLower = filters.searchQuery.toLowerCase();
      result = result.filter(
        product => product.name.toLowerCase().includes(searchLower) ||
                  product.description.toLowerCase().includes(searchLower) ||
                  product.category.toLowerCase().includes(searchLower)
      );
    }
    
    // Apply category filter
    if (filters.category) {
      result = result.filter(product => 
        product.categorySlug === filters.category
      );
    }
    
    // Apply organic filter
    if (filters.isOrganic) {
      result = result.filter(product => product.isOrganic);
    }
    
    // Apply medicinal filter
    if (filters.isMedicinal) {
      result = result.filter(product => product.isMedicinal);
    }
    
    // Apply sorting
    switch (filters.sortBy) {
      case 'price-low':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        result.sort((a, b) => b.rating - a.rating);
        break;
      case 'newest':
        result.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
        break;
      default: // 'featured'
        result.sort((a, b) => (b.isBestSeller ? 1 : 0) - (a.isBestSeller ? 1 : 0));
    }
    
    setFilteredProducts(result);
    setIsLoading(false);
  }, [filters]);

  const activeFilters = [
    ...(filters.category ? [{
      label: filters.category.split('-').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
      ).join(' '),
      value: filters.category,
      onRemove: () => setFilters(f => ({ ...f, category: '' }))
    }] : []),
    ...(filters.isMedicinal ? [{
      label: 'Medicinal',
      value: 'medicinal',
      onRemove: () => setFilters(f => ({ ...f, isMedicinal: false }))
    }] : []),
    ...(filters.isOrganic ? [{
      label: 'Organic',
      value: 'organic',
      onRemove: () => setFilters(f => ({ ...f, isOrganic: false }))
    }] : [])
  ];
  
  const clearAllFilters = () => {
    setFilters({
      searchQuery: '',
      sortBy: 'featured',
      isMedicinal: false,
      isOrganic: false,
      category: ''
    });
  };

  return (
    <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Our Plant Collection</h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          Discover a wide variety of beautiful plants for your home and garden. From easy-care succulents to stunning flowering plants, we have something for every plant lover.
        </p>
      </div>

      {/* Search and Filter Bar */}
      <div className="bg-white rounded-xl shadow-sm p-4 mb-8">
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <div className="relative flex-1 w-full">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search plants..."
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              value={filters.searchQuery || ''}
              onChange={(e) => setFilters({ ...filters, searchQuery: e.target.value })}
            />
          </div>
          
          <div className="w-full md:w-auto">
            <select
              className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
              value={filters.sortBy}
              onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })}
            >
              <option value="featured">Sort by: Featured</option>
              <option value="newest">Newest Arrivals</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Top Rated</option>
            </select>
          </div>
          
          <div className="w-full md:w-auto">
            <select
              className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
              value={filters.category}
              onChange={(e) => setFilters({ ...filters, category: e.target.value })}
            >
              <option value="">All Categories</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Active Filters */}
        {activeFilters.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {activeFilters.map((filter) => (
              <span
                key={filter.value}
                className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800"
              >
                {filter.label}
                <button
                  type="button"
                  className="ml-1.5 inline-flex items-center justify-center h-4 w-4 rounded-full bg-green-200 text-green-600 hover:bg-green-300 focus:outline-none"
                  onClick={filter.onRemove}
                >
                  <span className="sr-only">Remove filter</span>
                  <svg className="h-2 w-2" fill="currentColor" viewBox="0 0 8 8">
                    <path d="M7.1 1.4L4.7 4l2.4 2.4-1.1 1.1L3.6 5.1 1.2 7.5 0 6.3 2.4 4 0 1.7 1.2.5l2.4 2.4L6 .5 7.1 1.4z" />
                  </svg>
                </button>
              </span>
            ))}
            <button
              type="button"
              onClick={clearAllFilters}
              className="text-sm text-primary hover:text-primary-700 ml-2 self-center"
            >
              Clear all
            </button>
          </div>
        )}
      </div>

      {/* Filter Toggles */}
      <div className="flex flex-wrap gap-4 mb-6">
        <label className="inline-flex items-center">
          <input
            type="checkbox"
            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            checked={!!filters.isOrganic}
            onChange={(e) => setFilters({ ...filters, isOrganic: e.target.checked })}
          />
          <span className="ml-2 text-sm text-gray-700">Organic</span>
        </label>
        <label className="inline-flex items-center">
          <input
            type="checkbox"
            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            checked={!!filters.isMedicinal}
            onChange={(e) => setFilters({ ...filters, isMedicinal: e.target.checked })}
          />
          <span className="ml-2 text-sm text-gray-700">Medicinal</span>
        </label>
      </div>

      {/* Products Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="animate-pulse bg-gray-100 rounded-xl aspect-[3/4]" />
          ))}
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="text-center py-16">
          <div className="mx-auto w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-6">
            <Search className="h-10 w-10 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-3">No products found</h3>
          <p className="text-gray-500 mb-6">
            We couldn't find any products matching your criteria. Try adjusting your filters.
          </p>
          <button
            onClick={clearAllFilters}
            className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
          >
            Clear all filters
          </button>
        </div>
      ) : (
        <>
          <div className="mb-4 text-sm text-gray-500">
            Showing {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'}
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <div key={product.id} className="group relative bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
                <div className="aspect-square bg-gray-100 relative overflow-hidden">
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {product.isNew && (
                    <span className="absolute top-3 right-3 bg-primary text-white text-xs font-bold px-2.5 py-1 rounded-full">
                      New
                    </span>
                  )}
                  {product.discount && (
                    <span className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                      {product.discount}% OFF
                    </span>
                  )}
                  {product.isBestSeller && (
                    <span className="absolute top-10 left-3 bg-yellow-500 text-white text-xs font-bold px-2 py-1 rounded">
                      Best Seller
                    </span>
                  )}
                </div>
                <div className="p-4">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-gray-500">{product.category}</span>
                    <div className="flex items-center">
                      <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      <span className="ml-1 text-sm text-gray-600">
                        {product.rating} <span className="text-gray-400">({product.reviewCount})</span>
                      </span>
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-1">
                    {product.name}
                  </h3>
                  <p className="text-sm text-gray-500 mb-3 line-clamp-2 min-h-[2.5rem]">
                    {product.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-lg font-bold text-gray-900">
                        ${product.price.toFixed(2)}
                      </span>
                      {product.originalPrice && (
                        <span className="ml-2 text-sm text-gray-500 line-through">
                          ${product.originalPrice.toFixed(2)}
                        </span>
                      )}
                    </div>
                    <button className="bg-green-100 text-green-800 hover:bg-green-200 text-sm font-medium px-3 py-1.5 rounded-full transition-colors">
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
