'use client';

import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, X } from 'lucide-react';
import { api } from '@/lib/api';

const PRICE_RANGES = [
  { id: '0-500', label: 'Under ₹500' },
  { id: '500-1000', label: '₹500 - ₹1000' },
  { id: '1000-2000', label: '₹1000 - ₹2000' },
  { id: '2000-5000', label: '₹2000 - ₹5000' },
  { id: '5000-10000', label: '₹5000+' },
];

const PLANT_TYPES = [
  { id: 'indoor', name: 'Indoor Plants' },
  { id: 'outdoor', name: 'Outdoor Plants' },
  { id: 'flowering', name: 'Flowering Plants' },
  { id: 'succulents', name: 'Succulents' },
  { id: 'cacti', name: 'Cacti' },
  { id: 'bonsai', name: 'Bonsai' },
  { id: 'herbs', name: 'Herbs' },
  { id: 'vegetables', name: 'Vegetable Plants' },
  { id: 'medicinal', name: 'Medicinal Plants' },
];

const SUNLIGHT_REQUIREMENTS = [
  { id: 'full-sun', name: 'Full Sun (6+ hours)' },
  { id: 'partial-sun', name: 'Partial Sun (3-6 hours)' },
  { id: 'shade', name: 'Shade (Less than 3 hours)' },
];

const WATER_NEEDS = [
  { id: 'low', name: 'Low (Drought Tolerant)' },
  { id: 'moderate', name: 'Moderate' },
  { id: 'high', name: 'High (Lots of Water)' },
];

const MAINTENANCE_LEVEL = [
  { id: 'easy', name: 'Easy to Maintain' },
  { id: 'moderate', name: 'Moderate Maintenance' },
  { id: 'high', name: 'High Maintenance' },
];

const PLANT_SIZES = [
  { id: 'small', name: 'Small (Under 1 ft)' },
  { id: 'medium', name: 'Medium (1-3 ft)' },
  { id: 'large', name: 'Large (3-6 ft)' },
  { id: 'xlarge', name: 'Extra Large (6+ ft)' },
];

export function SearchFilters() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    categories: true,
    price: true,
    plantType: true,
    sunlight: true,
    waterNeeds: true,
    maintenance: true,
    size: true,
    ratings: true,
    specialOffers: true,
  });
  
  const [categories, setCategories] = useState<Array<{ id: string; name: string; count: number }>>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get('/categories?limit=20');
        setCategories(response.data.data);
      } catch (error) {
        console.error('Failed to fetch categories:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchCategories();
  }, []);
  
  const toggleSection = (section: string) => {
    setOpenSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const isChecked = (filterType: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    const paramValue = params.get(filterType);
    return paramValue ? paramValue.split(',').includes(value) : false;
  };

  const handleFilterChange = (filterType: string, value: string, isChecked: boolean) => {
    const params = new URLSearchParams(searchParams.toString());
    const currentValues = params.get(filterType)?.split(',').filter(Boolean) || [];
    
    if (isChecked) {
      // Add the filter
      if (!currentValues.includes(value)) {
        params.set(filterType, [...currentValues, value].join(','));
      }
    } else {
      // Remove the filter
      const newValues = currentValues.filter(v => v !== value);
      if (newValues.length > 0) {
        params.set(filterType, newValues.join(','));
      } else {
        params.delete(filterType);
      }
    }
    
    // Reset to first page when filters change
    params.set('page', '1');
    
    router.push(`${pathname}?${params.toString()}`);
  };
  
  const updateFilters = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    
    // Toggle filter - remove if already exists, add if not
    if (params.has(key, value)) {
      const values = params.getAll(key).filter(v => v !== value);
      params.delete(key);
      values.forEach(v => params.append(key, v));
    } else {
      params.append(key, value);
    }
    
    // Reset to first page when filters change
    params.delete('page');
    
    router.push(`${pathname}?${params.toString()}`);
  };
  
  const clearAllFilters = () => {
    router.push('/search');
  };
  
  const isFilterActive = (key: string, value: string) => {
    return searchParams.getAll(key).includes(value);
  };
  
  // Get active filter count
  const activeFilterCount = Array.from(searchParams.entries())
    .filter(([key]) => !['q', 'page', 'sort', 'limit'].includes(key))
    .length;
  
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-medium text-lg">Filters</h2>
        {activeFilterCount > 0 && (
          <button
            onClick={clearAllFilters}
            className="text-sm text-green-600 hover:text-green-800 flex items-center"
          >
            Clear all
            <X className="ml-1 h-4 w-4" />
          </button>
        )}
      </div>
      
      <div className="space-y-6">
        {/* Categories */}
        <div className="border-b border-gray-200 pb-4">
          <button
            className="flex w-full items-center justify-between text-sm font-medium text-gray-900"
            onClick={() => toggleSection('categories')}
          >
            <span>Categories</span>
            {openSections.categories ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
          </button>
          
          {openSections.categories && (
            <div className="mt-4 space-y-2">
              {isLoading ? (
                <div className="space-y-2">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="h-4 bg-gray-100 rounded animate-pulse"></div>
                  ))}
                </div>
              ) : (
                categories.map((category) => (
                  <div key={category.id} className="flex items-center">
                    <input
                      id={`category-${category.id}`}
                      name="category"
                      type="checkbox"
                      className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
                      checked={isChecked('category', category.id.toString())}
                      onChange={(e) => handleFilterChange('category', category.id.toString(), e.target.checked)}
                    />
                    <label htmlFor={`category-${category.id}`} className="ml-3 text-sm text-gray-600">
                      {category.name} <span className="text-gray-400">({category.count})</span>
                    </label>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* Price Range */}
        <div className="border-b border-gray-200 pb-4">
          <button
            className="flex w-full items-center justify-between text-sm font-medium text-gray-900"
            onClick={() => toggleSection('price')}
          >
            <span>Price Range</span>
            {openSections.price ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
          </button>
          
          {openSections.price && (
            <div className="mt-4 space-y-2">
              {PRICE_RANGES.map((range) => (
                <div key={range.id} className="flex items-center">
                  <input
                    id={`price-${range.id}`}
                    name="price"
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
                    checked={isChecked('price', range.id)}
                    onChange={(e) => handleFilterChange('price', range.id, e.target.checked)}
                  />
                  <label htmlFor={`price-${range.id}`} className="ml-3 text-sm text-gray-600">
                    {range.label}
                  </label>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Plant Type */}
        <div className="border-b border-gray-200 pb-4">
          <button
            className="flex w-full items-center justify-between text-sm font-medium text-gray-900"
            onClick={() => toggleSection('plantType')}
          >
            <span>Plant Type</span>
            {openSections.plantType ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
          </button>
          
          {openSections.plantType && (
            <div className="mt-4 space-y-2">
              {PLANT_TYPES.map((type) => (
                <div key={type.id} className="flex items-center">
                  <input
                    id={`type-${type.id}`}
                    name="plantType"
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
                    checked={isChecked('plantType', type.id)}
                    onChange={(e) => handleFilterChange('plantType', type.id, e.target.checked)}
                  />
                  <label htmlFor={`type-${type.id}`} className="ml-3 text-sm text-gray-600">
                    {type.name}
                  </label>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Sunlight Requirements */}
        <div className="border-b border-gray-200 pb-4">
          <button
            className="flex w-full items-center justify-between text-sm font-medium text-gray-900"
            onClick={() => toggleSection('sunlight')}
          >
            <span>Sunlight</span>
            {openSections.sunlight ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
          </button>
          
          {openSections.sunlight && (
            <div className="mt-4 space-y-2">
              {SUNLIGHT_REQUIREMENTS.map((item) => (
                <div key={item.id} className="flex items-center">
                  <input
                    id={`sunlight-${item.id}`}
                    name="sunlight"
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
                    checked={isChecked('sunlight', item.id)}
                    onChange={(e) => handleFilterChange('sunlight', item.id, e.target.checked)}
                  />
                  <label htmlFor={`sunlight-${item.id}`} className="ml-3 text-sm text-gray-600">
                    {item.name}
                  </label>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Water Needs */}
        <div className="border-b border-gray-200 pb-4">
          <button
            className="flex w-full items-center justify-between text-sm font-medium text-gray-900"
            onClick={() => toggleSection('waterNeeds')}
          >
            <span>Water Needs</span>
            {openSections.waterNeeds ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
          </button>
          
          {openSections.waterNeeds && (
            <div className="mt-4 space-y-2">
              {WATER_NEEDS.map((item) => (
                <div key={item.id} className="flex items-center">
                  <input
                    id={`water-${item.id}`}
                    name="waterNeeds"
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
                    checked={isChecked('waterNeeds', item.id)}
                    onChange={(e) => handleFilterChange('waterNeeds', item.id, e.target.checked)}
                  />
                  <label htmlFor={`water-${item.id}`} className="ml-3 text-sm text-gray-600">
                    {item.name}
                  </label>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Maintenance Level */}
        <div className="border-b border-gray-200 pb-4">
          <button
            className="flex w-full items-center justify-between text-sm font-medium text-gray-900"
            onClick={() => toggleSection('maintenance')}
          >
            <span>Maintenance Level</span>
            {openSections.maintenance ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
          </button>
          
          {openSections.maintenance && (
            <div className="mt-4 space-y-2">
              {MAINTENANCE_LEVEL.map((item) => (
                <div key={item.id} className="flex items-center">
                  <input
                    id={`maintenance-${item.id}`}
                    name="maintenance"
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
                    checked={isChecked('maintenance', item.id)}
                    onChange={(e) => handleFilterChange('maintenance', item.id, e.target.checked)}
                  />
                  <label htmlFor={`maintenance-${item.id}`} className="ml-3 text-sm text-gray-600">
                    {item.name}
                  </label>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Plant Size */}
        <div className="border-b border-gray-200 pb-4">
          <button
            className="flex w-full items-center justify-between text-sm font-medium text-gray-900"
            onClick={() => toggleSection('size')}
          >
            <span>Plant Size</span>
            {openSections.size ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
          </button>
          
          {openSections.size && (
            <div className="mt-4 space-y-2">
              {PLANT_SIZES.map((item) => (
                <div key={item.id} className="flex items-center">
                  <input
                    id={`size-${item.id}`}
                    name="size"
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
                    checked={isChecked('size', item.id)}
                    onChange={(e) => handleFilterChange('size', item.id, e.target.checked)}
                  />
                  <label htmlFor={`size-${item.id}`} className="ml-3 text-sm text-gray-600">
                    {item.name}
                  </label>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Ratings */}
        <div className="border-b border-gray-200 pb-4">
          <button
            className="flex w-full items-center justify-between text-sm font-medium text-gray-900"
            onClick={() => toggleSection('ratings')}
          >
            <span>Customer Ratings</span>
            {openSections.ratings ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
          </button>
          
          {openSections.ratings && (
            <div className="mt-4 space-y-2">
              {[5, 4, 3, 2, 1].map((rating) => (
                <div key={rating} className="flex items-center">
                  <input
                    id={`rating-${rating}`}
                    name="rating"
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
                    checked={isChecked('rating', rating.toString())}
                    onChange={(e) => handleFilterChange('rating', rating.toString(), e.target.checked)}
                  />
                  <div className="ml-3 flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className={`h-4 w-4 ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                    <span className="ml-1 text-sm text-gray-500">&amp; Up</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Special Offers */}
        <div className="border-b border-gray-200 pb-4">
          <button
            className="flex w-full items-center justify-between text-sm font-medium text-gray-900"
            onClick={() => toggleSection('specialOffers')}
          >
            <span>Special Offers</span>
            {openSections.specialOffers ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
          </button>
          
          {openSections.specialOffers && (
            <div className="mt-4 space-y-2">
              <div className="flex items-center">
                <input
                  id="on-sale"
                  name="onSale"
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
                  checked={isChecked('onSale', 'true')}
                  onChange={(e) => handleFilterChange('onSale', 'true', e.target.checked)}
                />
                <label htmlFor="on-sale" className="ml-3 text-sm text-gray-600">
                  On Sale
                </label>
              </div>
              <div className="flex items-center">
                <input
                  id="new-arrival"
                  name="newArrival"
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
                  checked={isChecked('newArrival', 'true')}
                  onChange={(e) => handleFilterChange('newArrival', 'true', e.target.checked)}
                />
                <label htmlFor="new-arrival" className="ml-3 text-sm text-gray-600">
                  New Arrivals
                </label>
              </div>
            </div>
          )}
        </div>

        {/* Clear All Filters */}
        <div className="pt-2">
          <button
            type="button"
            className="text-sm font-medium text-green-600 hover:text-green-500"
            onClick={() => router.push(pathname)}
          >
            Clear all filters
          </button>
        </div>
      </div>
    </div>
  );
}
