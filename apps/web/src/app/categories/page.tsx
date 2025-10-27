import { CategoryCard } from '@/components/categories/CategoryCard';
import { CategoriesSearch } from '@/components/categories/CategoriesSearch';
import { Metadata } from 'next';
import { Search } from 'lucide-react';

// Import categories data
import categoriesData from '@/data/categories.json';

// Add some featured categories
const featuredCategories = [
  'indoor-plants',
  'flowering-plants',
  'vegetable-seeds',
  'organic-fertilizers'
];

export const metadata: Metadata = {
  title: 'Plant Categories | Nurtury',
  description: 'Explore our wide range of plant categories including indoor plants, outdoor plants, seeds, and gardening supplies',
  keywords: 'plant categories, indoor plants, outdoor plants, seeds, gardening tools, planters, fertilizers, garden decor',
};

export default function CategoriesPage({
  searchParams,
}: {
  searchParams?: {
    query?: string;
  };
}) {
  const searchQuery = searchParams?.query?.toLowerCase() || '';

  // Filter categories based on search query
  const filteredCategories = categoriesData.filter(category => 
    category.name.toLowerCase().includes(searchQuery) ||
    category.parentCategory.toLowerCase().includes(searchQuery)
  );

  // Group categories by parent category
  const categoriesByParent = filteredCategories.reduce((acc, category) => {
    const parent = category.parentCategory || 'Other';
    if (!acc[parent]) {
      acc[parent] = [];
    }
    acc[parent].push(category);
    return acc;
  }, {} as Record<string, typeof categoriesData>);

  // Get featured categories
  const featured = categoriesData.filter(cat => featuredCategories.includes(cat.slug));

  return (
    <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-8 md:p-12 mb-12 text-center max-w-4xl mx-auto">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          Explore Our Plant Categories
        </h1>
        <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto mb-8">
          Discover the perfect plants and gardening supplies for your home and garden.
          From indoor plants to outdoor gardening essentials, we have everything you need.
        </p>
        
        {/* Search Bar */}
        <div className="max-w-2xl mx-auto">
          <CategoriesSearch initialQuery={searchQuery} />
        </div>
      </div>

      {/* Featured Categories */}
      {!searchQuery && (
        <section className="mb-16 max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row items-center justify-between mb-8 px-4 sm:px-0">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 sm:mb-0">Featured Categories</h2>
            <a 
              href="#all-categories" 
              className="inline-flex items-center text-primary hover:underline text-sm font-medium transition-colors"
            >
              View all categories
              <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </a>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 px-4 sm:px-0">
            {featured.map((category) => (
              <CategoryCard 
                key={category.id}
                {...category}
                className="h-full transform transition-all duration-300 hover:scale-[1.02] hover:shadow-md"
              />
            ))}
          </div>
        </section>
      )}

      {/* All Categories */}
      <div id="all-categories" className="space-y-12 max-w-7xl mx-auto">
        {Object.entries(categoriesByParent).map(([parent, categories]) => (
          <section key={parent} className="scroll-mt-20 px-4 sm:px-0">
            <div className="flex flex-col sm:flex-row items-baseline justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                {parent}
                <span className="ml-3 text-sm font-normal text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                  {categories.length} {categories.length === 1 ? 'category' : 'categories'}
                </span>
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {categories.map((category) => (
                <CategoryCard 
                  key={category.id}
                  {...category}
                  showParent={false}
                  className="h-full"
                />
              ))}
            </div>
          </section>
        ))}
      </div>

      {/* Empty State */}
      {filteredCategories.length === 0 && (
        <div className="text-center py-16 max-w-2xl mx-auto px-4">
          <div className="mx-auto w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-6">
            <Search className="h-10 w-10 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-3">No categories found</h3>
          <p className="text-gray-500 mb-6">
            We couldn't find any categories matching "{searchQuery}". Try searching for something else.
          </p>
          <a 
            href="/categories" 
            className="inline-flex items-center px-6 py-2.5 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary/90 transition-colors shadow-sm"
          >
            View All Categories
          </a>
        </div>
      )}
    </div>
  );
}
