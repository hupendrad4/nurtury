'use client';

import { useState } from 'react';

interface FilterProps {
  onFilterChange: (filters: any) => void;
  categories: any[];
  selectedCategory: string;
  onCategoryChange: (categoryId: string) => void;
}

export function ProductFilters({ onFilterChange, categories, selectedCategory, onCategoryChange }: FilterProps) {
  const [priceRange, setPriceRange] = useState({ min: 0, max: 10000 });
  const [selectedFilters, setSelectedFilters] = useState<any>({
    isMedicinal: false,
    isOrganic: false,
    inStock: true,
    rating: 0,
  });

  const handlePriceChange = (type: 'min' | 'max', value: string) => {
    const newRange = { ...priceRange, [type]: parseInt(value) || 0 };
    setPriceRange(newRange);
    onFilterChange({ ...selectedFilters, priceRange: newRange });
  };

  const handleFilterToggle = (filterKey: string, value: any) => {
    const newFilters = { ...selectedFilters, [filterKey]: value };
    setSelectedFilters(newFilters);
    onFilterChange({ ...newFilters, priceRange });
  };

  const clearAllFilters = () => {
    setPriceRange({ min: 0, max: 10000 });
    setSelectedFilters({ isMedicinal: false, isOrganic: false, inStock: true, rating: 0 });
    onCategoryChange('');
    onFilterChange({});
  };

  const activeFiltersCount = Object.values(selectedFilters).filter(Boolean).length + (selectedCategory ? 1 : 0);

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6 sticky top-4">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold">Filters</h3>
        {activeFiltersCount > 0 && (
          <button
            onClick={clearAllFilters}
            className="text-sm text-primary hover:text-primary-dark font-medium"
          >
            Clear All ({activeFiltersCount})
          </button>
        )}
      </div>

      {/* Categories */}
      <div className="mb-6">
        <h4 className="font-semibold mb-3 text-sm uppercase text-gray-700">Categories</h4>
        <div className="space-y-2">
          <label className="flex items-center cursor-pointer hover:bg-gray-50 p-2 rounded transition-colors">
            <input
              type="radio"
              name="category"
              checked={!selectedCategory}
              onChange={() => onCategoryChange('')}
              className="w-4 h-4 text-primary focus:ring-primary"
            />
            <span className="ml-2 text-sm">All Categories</span>
          </label>
          {categories?.map((category: any) => (
            <label
              key={category.id}
              className="flex items-center cursor-pointer hover:bg-gray-50 p-2 rounded transition-colors"
            >
              <input
                type="radio"
                name="category"
                checked={selectedCategory === category.id}
                onChange={() => onCategoryChange(category.id)}
                className="w-4 h-4 text-primary focus:ring-primary"
              />
              <span className="ml-2 text-sm">{category.name}</span>
              <span className="ml-auto text-xs text-gray-500">({category._count?.products || 0})</span>
            </label>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div className="mb-6 pb-6 border-b">
        <h4 className="font-semibold mb-3 text-sm uppercase text-gray-700">Price Range</h4>
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <input
              type="number"
              placeholder="Min"
              value={priceRange.min}
              onChange={(e) => handlePriceChange('min', e.target.value)}
              className="w-full px-3 py-2 border rounded-lg text-sm"
            />
            <span className="text-gray-500">-</span>
            <input
              type="number"
              placeholder="Max"
              value={priceRange.max}
              onChange={(e) => handlePriceChange('max', e.target.value)}
              className="w-full px-3 py-2 border rounded-lg text-sm"
            />
          </div>
          <input
            type="range"
            min="0"
            max="10000"
            step="100"
            value={priceRange.max}
            onChange={(e) => handlePriceChange('max', e.target.value)}
            className="w-full accent-primary"
          />
          <div className="flex justify-between text-xs text-gray-500">
            <span>₹{priceRange.min}</span>
            <span>₹{priceRange.max}</span>
          </div>
        </div>
      </div>

      {/* Special Features */}
      <div className="mb-6 pb-6 border-b">
        <h4 className="font-semibold mb-3 text-sm uppercase text-gray-700">Special Features</h4>
        <div className="space-y-2">
          <label className="flex items-center cursor-pointer hover:bg-gray-50 p-2 rounded transition-colors">
            <input
              type="checkbox"
              checked={selectedFilters.isMedicinal}
              onChange={(e) => handleFilterToggle('isMedicinal', e.target.checked)}
              className="w-4 h-4 text-primary focus:ring-primary rounded"
            />
            <span className="ml-2 text-sm">Medicinal Plants</span>
          </label>
          <label className="flex items-center cursor-pointer hover:bg-gray-50 p-2 rounded transition-colors">
            <input
              type="checkbox"
              checked={selectedFilters.isOrganic}
              onChange={(e) => handleFilterToggle('isOrganic', e.target.checked)}
              className="w-4 h-4 text-primary focus:ring-primary rounded"
            />
            <span className="ml-2 text-sm">Organic</span>
          </label>
          <label className="flex items-center cursor-pointer hover:bg-gray-50 p-2 rounded transition-colors">
            <input
              type="checkbox"
              checked={selectedFilters.inStock}
              onChange={(e) => handleFilterToggle('inStock', e.target.checked)}
              className="w-4 h-4 text-primary focus:ring-primary rounded"
            />
            <span className="ml-2 text-sm">In Stock Only</span>
          </label>
        </div>
      </div>

      {/* Rating Filter */}
      <div className="mb-6">
        <h4 className="font-semibold mb-3 text-sm uppercase text-gray-700">Customer Rating</h4>
        <div className="space-y-2">
          {[4, 3, 2, 1].map((rating) => (
            <label
              key={rating}
              className="flex items-center cursor-pointer hover:bg-gray-50 p-2 rounded transition-colors"
            >
              <input
                type="radio"
                name="rating"
                checked={selectedFilters.rating === rating}
                onChange={() => handleFilterToggle('rating', rating)}
                className="w-4 h-4 text-primary focus:ring-primary"
              />
              <div className="ml-2 flex items-center">
                {[...Array(rating)].map((_, i) => (
                  <span key={i} className="text-yellow-500 text-sm">★</span>
                ))}
                {[...Array(5 - rating)].map((_, i) => (
                  <span key={i} className="text-gray-300 text-sm">★</span>
                ))}
                <span className="ml-1 text-sm text-gray-600">& Up</span>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Plant Care Level */}
      <div className="mb-6">
        <h4 className="font-semibold mb-3 text-sm uppercase text-gray-700">Care Level</h4>
        <div className="space-y-2">
          {['Easy', 'Medium', 'Expert'].map((level) => (
            <label
              key={level}
              className="flex items-center cursor-pointer hover:bg-gray-50 p-2 rounded transition-colors"
            >
              <input
                type="checkbox"
                className="w-4 h-4 text-primary focus:ring-primary rounded"
              />
              <span className="ml-2 text-sm">{level}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Light Requirements */}
      <div>
        <h4 className="font-semibold mb-3 text-sm uppercase text-gray-700">Light Requirement</h4>
        <div className="space-y-2">
          {['Full Sun', 'Partial Shade', 'Full Shade', 'Indoor'].map((light) => (
            <label
              key={light}
              className="flex items-center cursor-pointer hover:bg-gray-50 p-2 rounded transition-colors"
            >
              <input
                type="checkbox"
                className="w-4 h-4 text-primary focus:ring-primary rounded"
              />
              <span className="ml-2 text-sm">{light}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}

