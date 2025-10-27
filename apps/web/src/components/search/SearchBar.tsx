'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Search } from 'lucide-react';

export function SearchBar({ initialQuery = '' }: { initialQuery?: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(initialQuery);
  const [isTyping, setIsTyping] = useState(false);

  // Update local state when URL changes (e.g., when user navigates back/forward)
  useEffect(() => {
    const searchQuery = searchParams.get('q') || '';
    setQuery(searchQuery);
  }, [searchParams]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    
    const params = new URLSearchParams(searchParams.toString());
    params.set('q', query.trim());
    params.delete('page'); // Reset to first page on new search
    
    router.push(`/search?${params.toString()}`);
  };

  return (
    <form onSubmit={handleSearch} className="relative">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsTyping(true);
          }}
          onBlur={() => setIsTyping(false)}
          placeholder="Search for plants, seeds, tools..."
          className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg bg-white shadow-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 sm:text-sm transition-all duration-200"
        />
        <button
          type="submit"
          className="absolute inset-y-0 right-0 px-4 flex items-center bg-green-600 text-white rounded-r-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors duration-200"
        >
          Search
        </button>
      </div>
      
      {isTyping && query && (
        <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg">
          <div className="p-2 text-sm text-gray-500">
            Press Enter to search for "{query}"
          </div>
        </div>
      )}
    </form>
  );
}
