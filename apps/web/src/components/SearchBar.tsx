'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';

interface SearchBarProps {
  onSearch: (query: string) => void;
  value: string;
}

export function SearchBar({ onSearch, value }: SearchBarProps) {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [searchTerm, setSearchTerm] = useState(value);

  const { data: suggestions } = useQuery({
    queryKey: ['search-suggestions', searchTerm],
    queryFn: () =>
      searchTerm.length >= 2
        ? api.get(`/products/search?q=${searchTerm}&limit=5`).then(res => res.data)
        : Promise.resolve({ data: [] }),
    enabled: searchTerm.length >= 2,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchTerm(query);
    setShowSuggestions(true);
  };

  const handleSearch = () => {
    onSearch(searchTerm);
    setShowSuggestions(false);
  };

  const handleSuggestionClick = (productName: string) => {
    setSearchTerm(productName);
    onSearch(productName);
    setShowSuggestions(false);
  };

  return (
    <div className="relative flex-1">
      <div className="relative">
        <input
          type="text"
          placeholder="Search for plants, seeds, pots, and more..."
          className="w-full px-4 py-3 pl-12 pr-4 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none transition-colors"
          value={searchTerm}
          onChange={handleInputChange}
          onFocus={() => setShowSuggestions(true)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
        />
        <svg
          className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        {searchTerm && (
          <button
            onClick={() => {
              setSearchTerm('');
              onSearch('');
            }}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Search Suggestions */}
      {showSuggestions && suggestions?.data && suggestions.data.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
          <div className="p-2">
            <div className="text-xs text-gray-500 px-3 py-2 font-medium">Suggestions</div>
            {suggestions.data.map((product: any) => (
              <button
                key={product.id}
                onClick={() => handleSuggestionClick(product.name)}
                className="w-full text-left px-3 py-2 hover:bg-gray-50 rounded-lg transition-colors flex items-center gap-3"
              >
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <div className="flex-1">
                  <div className="text-sm font-medium">{product.name}</div>
                  <div className="text-xs text-gray-500">{product.category?.name}</div>
                </div>
                <div className="text-sm font-bold text-primary">₹{product.basePrice}</div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Click outside to close */}
      {showSuggestions && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowSuggestions(false)}
        />
      )}
    </div>
  );
}

