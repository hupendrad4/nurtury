'use client';

import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { ProductFilters } from '@/components/ProductFilters';
import { ProductCard } from '@/components/ProductCard';
import { SearchBar } from '@/components/SearchBar';
import { Breadcrumb } from '@/components/Breadcrumb';
import { ActiveFilters } from '@/components/ActiveFilters';
import { TrustBadges } from '@/components/TrustBadges';

type Category = { id: string; name: string };
type Product = { id: string; /* add other fields you use inside ProductCard */ };
type ProductsResponse = {
  data: Product[];
  total: number;
  page?: number;
  totalPages?: number;
};

type Filters = {
  isMedicinal?: boolean;
  isOrganic?: boolean;
  // add more filter fields as needed
};

export default function ProductsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [filters, setFilters] = useState<Filters>({});
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const { data: categories } = useQuery<Category[]>({
    queryKey: ['categories'],
    queryFn: () => api.get('/categories').then((res) => res.data),
  });

  // Make filters stable for queryKey
  const filtersKey = useMemo(() => JSON.stringify(filters), [filters]);

  const { data: products, isLoading } = useQuery<ProductsResponse>({
    queryKey: ['products', searchQuery, sortBy, selectedCategory, filtersKey],
    queryFn: () => {
      let url = '/products';
      const params = new URLSearchParams();

      if (searchQuery) {
        url = '/products/search';
        params.append('q', searchQuery);
      }

      params.append('sortBy', sortBy);
      params.append('limit', '24');

      if (selectedCategory) {
        params.append('categoryId', selectedCategory);
      }

      // If backend supports filters via query params, append them here
      if (filters.isMedicinal) params.append('isMedicinal', 'true');
      if (filters.isOrganic) params.append('isOrganic', 'true');

      return api.get(`${url}?${params.toString()}`).then((res) => res.data);
    },
  });

  const activeFilters: {
    label: string;
    value: string;
    onRemove: () => void;
  }[] = [];

  if (selectedCategory) {
    const category = categories?.find((c) => c.id === selectedCategory);
    activeFilters.push({
      label: category?.name || 'Category',
      value: selectedCategory,
      onRemove: () => setSelectedCategory(''),
    });
  }
  if (filters.isMedicinal) {
    activeFilters.push({
      label: 'Medicinal Plants',
      value: 'medicinal',
      onRemove: () => setFilters((f) => ({ ...f, isMedicinal: false })),
    });
  }
  if (filters.isOrganic) {
    activeFilters.push({
      label: 'Organic',
      value: 'organic',
      onRemove: () => setFilters((f) => ({ ...f, isOrganic: false })),
    });
  }

  const clearAllFilters = () => {
    setSelectedCategory('');
    setFilters({});
    setSearchQuery('');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-6">
          <Breadcrumb items={[{ label: 'Products' }]} />

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">All Products</h1>
              <p className="text-gray-600">
                Discover our complete range of garden plants, seeds, tools, and accessories
              </p>
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-lg">
              <button
                onClick={() => setViewMode('grid')}
                className={`px-4 py-2 rounded transition-colors ${
                  viewMode === 'grid' ? 'bg-white shadow-sm' : 'text-gray-600'
                }`}
                aria-pressed={viewMode === 'grid'}
                aria-label="Grid view"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                  <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-4 py-2 rounded transition-colors ${
                  viewMode === 'list' ? 'bg-white shadow-sm' : 'text-gray-600'
                }`}
                aria-pressed={viewMode === 'list'}
                aria-label="List view"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                  <path
                    fillRule="evenodd"
                    d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* Search Bar */}
          <div className="flex flex-col md:flex-row gap-4">
            <SearchBar onSearch={setSearchQuery} value={searchQuery} />
            <select
              className="px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none transition-colors min-w-[200px]"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="newest">Newest First</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
              <option value="name">Name A-Z</option>
              <option value="popular">Most Popular</option>
            </select>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Active Filters */}
        <ActiveFilters filters={activeFilters} onClearAll={clearAllFilters} />

        <div className="flex gap-8">
          {/* Sidebar Filters */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <ProductFilters
              onFilterChange={setFilters}
              categories={categories || []}
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
            />
          </aside>

          {/* Products Grid */}
          <div className="flex-1">
            {/* Results Summary */}
            {!isLoading && products && (
              <div className="flex items-center justify-between mb-6">
                <div className="text-gray-600">
                  Showing{' '}
                  <span className="font-semibold text-gray-900">
                    {products.data?.length || 0}
                  </span>{' '}
                  of{' '}
                  <span className="font-semibold text-gray-900">
                    {products.total || 0}
                  </span>{' '}
                  products
                  {selectedCategory && (
                    <span className="text-primary font-medium">
                      {' '}
                      in {categories?.find((c) => c.id === selectedCategory)?.name}
                    </span>
                  )}
                </div>
              </div>
            )}

            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-20">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mb-4" />
                <p className="text-gray-600">Loading products...</p>
              </div>
            ) : products?.data?.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-lg">
                <svg
                  className="w-24 h-24 text-gray-300 mx-auto mb-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">No products found</h3>
                <p className="text-gray-500 mb-6">Try adjusting your filters or search query</p>
                <button onClick={clearAllFilters} className="btn-primary">
                  Clear All Filters
                </button>
              </div>
            ) : (
              <div
                className={
                  viewMode === 'grid'
                    ? 'grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6'
                    : 'space-y-4'
                }
              >
                {products?.data?.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}

            {/* Pagination */}
            {products && (products.totalPages ?? 1) > 1 && (
              <div className="mt-12 flex justify-center">
                <div className="flex space-x-2">
                  {Array.from({ length: products.totalPages! }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      // TODO: wire up to change page in your query (e.g., add page param)
                      className={`px-3 py-2 rounded ${
                        page === (products.page ?? 1)
                          ? 'bg-primary text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* "Load More" (optional alternative to numbered pagination) */}
            {products && products.total > (products.data?.length ?? 0) && (
              <div className="mt-8 flex justify-center">
                <button className="btn-primary">Load More Products</button>
              </div>
            )}
          </div>
        </div>

        {/* Trust Badges Section */}
        <TrustBadges />

        {/* Plant Care Tips Banner */}
        <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-xl p-8 text-white mt-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex-1">
              <h3 className="text-2xl font-bold mb-2">Need Help Choosing Plants?</h3>
              <p className="text-green-100">
                Our plant experts are here to help you select the perfect plants for your space and climate.
              </p>
            </div>
            <button className="bg-white text-green-600 px-8 py-3 rounded-lg font-semibold hover:bg-green-50 transition-colors">
              Get Free Consultation
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
