'use client';

import { SearchFilters } from '@/components/search/SearchFilters';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Star as StarIcon, Filter as FilterIcon, X as XIcon } from 'lucide-react';
import { api } from '@/lib/api';
import { useRouter, usePathname } from 'next/navigation';

const SORT_OPTIONS = [
  { value: 'relevance', label: 'Relevance' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'rating-desc', label: 'Top Rated' },
  { value: 'newest', label: 'Newest Arrivals' },
];

interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  salePrice?: number;
  rating: number;
  reviewCount: number;
  images: string;
  inStock: boolean;
  isNew?: boolean;
  isOnSale?: boolean;
  category: {
    id: string;
    name: string;
    slug: string;
  };
  reviews: Array<{ rating: number }>;
}

interface SearchResultsProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

export default function SearchResults({
  searchParams: initialSearchParams = {},
}: SearchResultsProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedSort, setSelectedSort] = useState('relevance');
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const router = useRouter();
  const pathname = usePathname();
  
  // Get query parameters with proper type assertions
  const getParam = (key: string, defaultValue: string = ''): string => {
    const value = initialSearchParams[key];
    if (Array.isArray(value)) {
      return value[0]?.toString() || defaultValue;
    }
    return value?.toString() || defaultValue;
  };
  
  const query = getParam('q');
  const pageStr = getParam('page', '1');
  const page = parseInt(pageStr, 10) || 1;
  const sort = getParam('sort', 'relevance');
  const limit = 12;

  // Fetch products based on search and filters
  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        // Build query params
        const queryParams = new URLSearchParams();

        // Add search query if exists
        if (query) {
          queryParams.append('q', query);
        }

        // Add pagination
        queryParams.append('page', page.toString());
        queryParams.append('limit', limit.toString());

        // Add sorting
        queryParams.append('sort', sort);

        // Add filters from initialSearchParams
        Object.entries(initialSearchParams).forEach(([key, value]) => {
          if (['category', 'price', 'rating', 'inStock'].includes(key)) {
            if (Array.isArray(value)) {
              value.forEach((v) => queryParams.append(key, v));
            } else if (value) {
              queryParams.append(key, value);
            }
          }
        });

        const response = await api.get(`/products/search?${queryParams.toString()}`);

        if (response.data) {
          setProducts(response.data.data);
          setTotalCount(response.data.meta.total);
          setCurrentPage(response.data.meta.page);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [initialSearchParams, query, page, sort, router]);

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newSort = e.target.value;
    setSelectedSort(newSort);

    // Update URL with new sort parameter
    const newParams = new URLSearchParams();
    
    // Copy all existing params
    Object.entries(initialSearchParams).forEach(([key, value]) => {
      if (key !== 'sort' && key !== 'page') {
        const values = Array.isArray(value) ? value : [value];
        values.forEach((val) => {
          if (val) newParams.append(key, val.toString());
        });
      }
    });
    
    // Add new sort parameter
    newParams.set('sort', newSort);
    router.push(`/search?${newParams.toString()}`);
  };

  const renderProductCard = (product: Product) => {
    const images = JSON.parse(product.images || '[]');
    const mainImage = images[0]?.url || '/placeholder.png';
    const price = product.salePrice || product.price;

    return (
      <div key={product.id} className="group relative">
        <Link href={`/products/${product.slug}`} className="block">
          <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-lg bg-gray-100 group-hover:opacity-90 transition-opacity">
            <Image
              src={mainImage}
              alt={product.name}
              width={300}
              height={300}
              className="h-full w-full object-cover object-center"
            />
            {product.isOnSale && (
              <div className="absolute top-2 right-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-full">
                SALE
              </div>
            )}
            {product.isNew && (
              <div className="absolute top-2 left-2 bg-green-600 text-white text-xs font-bold px-2 py-1 rounded-full">
                NEW
              </div>
            )}
          </div>
          <div className="mt-4">
            <h3 className="text-sm text-gray-700 line-clamp-2 h-10">
              {product.name}
            </h3>
            <div className="mt-1 flex items-center">
              {renderStars(product.rating)}
              <span className="ml-1 text-xs text-gray-500">
                ({product.reviewCount})
              </span>
            </div>
            <div className="mt-2">
              <p className="text-sm font-medium text-gray-900">
                ₹{price.toLocaleString('en-IN')}
                {product.salePrice && (
                  <span className="ml-2 text-xs text-gray-500 line-through">
                    ₹{product.price.toLocaleString('en-IN')}
                  </span>
                )}
              </p>
            </div>
          </div>
        </Link>
        <button
          className="mt-2 w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors text-sm font-medium"
          onClick={(e) => {
            e.preventDefault();
            // Add to cart logic here
            console.log('Add to cart:', product.id);
          }}
        >
          Add to Cart
        </button>
      </div>
    );
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <StarIcon
            key={star}
            className={`h-4 w-4 ${star <= rating ? 'text-yellow-400' : 'text-gray-300'}`}
            fill={star <= rating ? 'currentColor' : 'none'}
          />
        ))}
      </div>
    );
  };

  const renderPagination = () => {
    const totalPages = Math.ceil(totalCount / limit);
    if (totalPages <= 1) return null;

    const pages = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    // Previous page button
    pages.push(
      <button
        key="prev"
        onClick={() => {
          const url = new URL(window.location.href);
          url.searchParams.set('page', (currentPage - 1).toString());
          window.location.href = url.toString();
        }}
        disabled={currentPage === 1}
        className={`px-3 py-1 rounded-md ${
          currentPage === 1
            ? 'text-gray-400 cursor-not-allowed'
            : 'text-gray-700 hover:bg-gray-100'
        }`}
      >
        &larr; Previous
      </button>
    );

    // Page numbers
    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => {
            const url = new URL(window.location.href);
            url.searchParams.set('page', i.toString());
            window.location.href = url.toString();
          }}
          className={`px-3 py-1 rounded-md ${
            i === currentPage
              ? 'bg-green-600 text-white'
              : 'text-gray-700 hover:bg-gray-100'
          }`}
        >
          {i}
        </button>
      );
    }

    // Next page button
    pages.push(
      <button
        key="next"
        onClick={() => {
          const url = new URL(window.location.href);
          url.searchParams.set('page', (currentPage + 1).toString());
          window.location.href = url.toString();
        }}
        disabled={currentPage === totalPages}
        className={`px-3 py-1 rounded-md ${
          currentPage === totalPages
            ? 'text-gray-400 cursor-not-allowed'
            : 'text-gray-700 hover:bg-gray-100'
        }`}
      >
        Next &rarr;
      </button>
    );

    return (
      <div className="flex items-center justify-center space-x-1 mt-8">
        {pages}
      </div>
    );
  };

  // Get active filters
  const activeFilters = [
    { key: 'category', value: getParam('category') },
    { key: 'price', value: getParam('price') },
    { key: 'rating', value: getParam('rating') },
    { key: 'inStock', value: getParam('inStock') },
  ].filter((filter): filter is { key: string; value: string } => 
    Boolean(filter.value)
  );

  const handleRemoveFilter = (key: string) => {
    const params = new URLSearchParams();
    
    // Copy all existing params except the one being removed
    Object.entries(initialSearchParams).forEach(([k, v]) => {
      if (k !== key && k !== 'page') {
        const values = Array.isArray(v) ? v : [v];
        values.forEach((val) => {
          if (val) {
            params.append(k, val.toString());
          }
        });
      }
    });
    
    // Update the URL
    const queryString = params.toString();
    router.push(queryString ? `${pathname}?${queryString}` : pathname);
  };

  return (
    <div>
      {/* Mobile filter dialog */}
      <div className="lg:hidden mb-4">
        <button
          type="button"
          className="flex items-center text-sm font-medium text-gray-700 hover:text-gray-900"
          onClick={() => setMobileFiltersOpen(true)}
        >
          <FilterIcon className="mr-2 h-5 w-5 text-gray-400" aria-hidden="true" />
          Filters
        </button>
        
        {mobileFiltersOpen && (
          <div className="fixed inset-0 z-40 flex lg:hidden">
            <div className="fixed inset-0 bg-black bg-opacity-25" />
            <div className="relative ml-auto flex h-full w-full max-w-xs flex-col overflow-y-auto bg-white py-4 pb-12 shadow-xl">
              <div className="flex items-center justify-between px-4">
                <h2 className="text-lg font-medium text-gray-900">Filters</h2>
                <button
                  type="button"
                  className="-mr-2 flex h-10 w-10 items-center justify-center rounded-md bg-white p-2 text-gray-400"
                  onClick={() => setMobileFiltersOpen(false)}
                >
                  <XIcon className="h-4 w-4" />
                </button>
              </div>
              
              {/* Filters */}
              <div className="mt-4 border-t border-gray-200">
                <SearchFilters />
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Active filters */}
      {activeFilters.length > 0 && (
        <div className="mb-6">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Active filters:</h3>
          <div className="flex flex-wrap gap-2">
            {activeFilters.map(({ key, value }) => (
              <span
                key={`${key}-${value}`}
                className="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-800"
              >
                {value}
                <button
                  type="button"
                  className="ml-1.5 inline-flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full text-gray-400 hover:bg-gray-200 hover:text-gray-500"
                  onClick={() => handleRemoveFilter(key)}
                >
                  <XIcon className="ml-1 h-4 w-4" />
                </button>
              </span>
            ))}
            <button
              type="button"
              className="ml-2 text-sm font-medium text-green-600 hover:text-green-500"
              onClick={() => {
                window.location.href = '/search';
              }}
            >
              Clear all
            </button>
          </div>
        </div>
      )}
      
      {/* Sort and results count */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <p className="text-sm text-gray-700 mb-2 sm:mb-0">
          {isLoading ? (
            'Loading...'
          ) : (
            `Showing ${(currentPage - 1) * limit + 1}-${Math.min(
              currentPage * limit,
              totalCount
            )} of ${totalCount} results`
          )}
        </p>
        
        <div className="flex items-center
        ">
          <label htmlFor="sort" className="mr-2 text-sm font-medium text-gray-700">
            Sort by:
          </label>
          <select
            id="sort"
            value={selectedSort}
            onChange={handleSortChange}
            className="rounded-md border border-gray-300 py-1 pl-3 pr-8 text-base focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500 sm:text-sm"
          >
            {SORT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>
      
      {/* Loading state */}
      {isLoading ? (
        <div className="grid grid-cols-1 gap-x-4 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-lg bg-gray-200"></div>
              <div className="mt-4 h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="mt-2 h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      ) : products.length === 0 ? (
        // No results state
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-gray-900">No products found</h3>
          <p className="mt-1 text-sm text-gray-500">
            Try adjusting your search or filter to find what you're looking for.
          </p>
          <div className="mt-6">
            <button
              type="button"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              onClick={() => {
                window.location.href = '/search';
              }}
            >
              Clear all filters
            </button>
          </div>
        </div>
      ) : (
        // Results grid
        <>
          <div className="grid grid-cols-1 gap-x-4 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((product) => renderProductCard(product))}
          </div>
          
          {/* Pagination */}
          {renderPagination()}
        </>
      )}
    </div>
  );
}
