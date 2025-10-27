'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect, useRef, useCallback } from 'react';
import { Search, X, Clock, ChevronRight } from 'lucide-react';

// Mock suggestions - in a real app, these would come from an API
const POPULAR_SEARCHES = [
  'Indoor Plants',
  'Succulents',
  'Gardening Tools',
  'Organic Fertilizers',
  'Flowering Plants',
];

// Mock categories for autocomplete
const CATEGORY_SUGGESTIONS = [
  { name: 'Indoor Plants', count: 42 },
  { name: 'Outdoor Plants', count: 36 },
  { name: 'Seeds', count: 28 },
  { name: 'Planters', count: 15 },
  { name: 'Gardening Tools', count: 9 },
];

type SuggestionType = 'search' | 'category' | 'popular';

interface Suggestion {
  type: SuggestionType;
  text: string;
  value: string;
}

export function ClientSearchBar({ initialQuery = '' }: { initialQuery?: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(initialQuery);
  const [isFocused, setIsFocused] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceTimer = useRef<NodeJS.Timeout>();

  // Load recent searches from localStorage
  useEffect(() => {
    const savedSearches = localStorage.getItem('recentSearches');
    if (savedSearches) {
      setRecentSearches(JSON.parse(savedSearches));
    }
  }, []);

  // Save search to recent searches
  const saveSearch = useCallback((searchTerm: string) => {
    if (!searchTerm.trim()) return;
    
    setRecentSearches(prev => {
      const updated = prev.filter(term => term.toLowerCase() !== searchTerm.toLowerCase());
      updated.unshift(searchTerm);
      const limited = updated.slice(0, 5);
      localStorage.setItem('recentSearches', JSON.stringify(limited));
      return limited;
    });
  }, []);

  // Handle click outside to close suggestions
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Debounced search
  const debouncedSearch = useCallback((searchTerm: string) => {
    if (!searchTerm.trim()) return;
    
    const params = new URLSearchParams(searchParams.toString());
    params.set('q', searchTerm.trim());
    params.delete('page');
    
    router.push(`/search?${params.toString()}`);
    saveSearch(searchTerm.trim());
  }, [router, searchParams, saveSearch]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }
    
    debouncedSearch(query);
    setShowSuggestions(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    setShowSuggestions(value.length > 0);
    
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }
    
    if (value.trim().length > 1) {
      debounceTimer.current = setTimeout(() => {
        debouncedSearch(value);
      }, 500);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion);
    setShowSuggestions(false);
    
    const params = new URLSearchParams(searchParams.toString());
    params.set('q', suggestion);
    params.delete('page');
    
    router.push(`/search?${params.toString()}`);
    saveSearch(suggestion);
  };

  const clearSearch = () => {
    setQuery('');
    inputRef.current?.focus();
  };

  // Filter suggestions based on current query
  const filteredSuggestions: Suggestion[] = query
    ? [
        ...(query.length > 1 ? [{
          type: 'search' as const,
          text: `Search for "${query}"`,
          value: query
        }] : []),
        
        ...CATEGORY_SUGGESTIONS
          .filter(cat => cat.name.toLowerCase().includes(query.toLowerCase()))
          .map(cat => ({
            type: 'category' as const,
            text: `${cat.name} (${cat.count})`,
            value: cat.name
          })),
          
        ...POPULAR_SEARCHES
          .filter(term => 
            term.toLowerCase().includes(query.toLowerCase()) && 
            !CATEGORY_SUGGESTIONS.some(cat => 
              cat.name.toLowerCase() === term.toLowerCase()
            )
          )
          .map(term => ({
            type: 'popular' as const,
            text: term,
            value: term
          }))
      ]
    : [];

  // Show states
  const showRecentSearches = isFocused && !query && recentSearches.length > 0;
  const showEmptyState = isFocused && !query && recentSearches.length === 0;
  const showFilteredSuggestions = showSuggestions && query;

    return (
    <div className="relative w-full" ref={searchContainerRef}>
      <form onSubmit={handleSearch} className="relative">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={handleInputChange}
            onFocus={() => {
              setIsFocused(true);
              setShowSuggestions(true);
            }}
            placeholder="Search for plants, seeds, tools..."
            className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg bg-white shadow-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 sm:text-sm transition-all duration-200"
            aria-label="Search products"
            aria-expanded={showSuggestions}
            aria-controls="search-suggestions"
          />
          {query && (
            <button
              type="button"
              onClick={clearSearch}
              className="absolute inset-y-0 right-10 flex items-center pr-3 text-gray-400 hover:text-gray-600"
              aria-label="Clear search"
            >
              <X className="h-4 w-4" />
            </button>
          )}
          <button
            type="submit"
            className="absolute inset-y-0 right-0 px-4 flex items-center bg-green-600 text-white rounded-r-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors duration-200"
            aria-label="Search"
          >
            <Search className="h-4 w-4" />
          </button>
        </div>
      </form>

      {/* Search Suggestions Dropdown */}
      {(showRecentSearches || showFilteredSuggestions || showEmptyState) && (
        <div 
          id="search-suggestions"
          className="absolute z-10 mt-1 w-full bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden"
        >
          {showRecentSearches && (
            <div className="p-2 border-b border-gray-100">
              <div className="px-3 py-1 text-xs font-medium text-gray-500 uppercase tracking-wider">
                Recent Searches
              </div>
              {recentSearches.map((searchTerm, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestionClick(searchTerm)}
                  className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center"
                >
                  <Clock className="h-4 w-4 text-gray-400 mr-2 flex-shrink-0" />
                  <span className="truncate">{searchTerm}</span>
                </button>
              ))}
            </div>
          )}

          {showFilteredSuggestions && (
            <div className="divide-y divide-gray-100">
              {filteredSuggestions.length > 0 ? (
                filteredSuggestions.map((suggestion, index) => (
                  <button
                    key={`${suggestion.type}-${index}`}
                    onClick={() => handleSuggestionClick(suggestion.value)}
                    className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center"
                  >
                    {suggestion.type === 'category' && (
                      <span className="h-4 w-4 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-xs mr-2 flex-shrink-0">
                        C
                      </span>
                    )}
                    {suggestion.type === 'popular' && (
                      <span className="h-4 w-4 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs mr-2 flex-shrink-0">
                        P
                      </span>
                    )}
                    {suggestion.type === 'search' && (
                      <Search className="h-4 w-4 text-gray-400 mr-2 flex-shrink-0" />
                    )}
                    <span className="truncate">{suggestion.text}</span>
                    <ChevronRight className="ml-auto h-4 w-4 text-gray-400" />
                  </button>
                ))
              ) : (
                <div className="p-4 text-center text-sm text-gray-500">
                  No results found for "{query}"
                </div>
              )}
            </div>
          )}

          {showEmptyState && (
            <div className="p-4 text-center text-sm text-gray-500">
              <p>Your recent searches will appear here</p>
              <div className="mt-2 grid grid-cols-2 gap-2">
                {POPULAR_SEARCHES.slice(0, 4).map((term) => (
                  <button
                    key={term}
                    onClick={() => handleSuggestionClick(term)}
                    className="px-3 py-1.5 text-xs bg-gray-50 hover:bg-gray-100 rounded-full text-gray-700 truncate"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
