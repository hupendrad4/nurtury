import { Suspense } from 'react';
import { SearchFilters } from '@/components/search/SearchFilters';
import { SearchResults } from '@/components/search/SearchResults';
import { ClientSearchBar } from '@/components/search/ClientSearchBar';

export default function SearchPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Find Your Perfect Plants</h1>
        <div className="max-w-2xl">
          <ClientSearchBar initialQuery={searchParams.q as string} />
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-64 flex-shrink-0">
          <Suspense fallback={<div className="animate-pulse h-64 bg-gray-100 rounded-lg"></div>}>
            <SearchFilters />
          </Suspense>
        </div>
        
        <div className="flex-1">
          <Suspense fallback={<div className="animate-pulse h-96 bg-gray-100 rounded-lg"></div>}>
            <SearchResults searchParams={searchParams} />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
