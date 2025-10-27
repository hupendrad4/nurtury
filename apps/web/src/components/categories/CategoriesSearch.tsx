'use client';

import { useRouter } from 'next/navigation';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface CategoriesSearchProps {
  initialQuery?: string;
}

export function CategoriesSearch({ initialQuery = '' }: CategoriesSearchProps) {
  const router = useRouter();

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const target = e.target as HTMLInputElement;
      router.push(`/categories?query=${encodeURIComponent(target.value)}`);
    }
  };

  return (
    <div className="max-w-2xl mx-auto relative">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
        <Input
          type="search"
          placeholder="Search categories..."
          className="pl-10 pr-4 py-6 text-base rounded-full shadow-sm border-2 border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20"
          defaultValue={initialQuery}
          onKeyDown={handleKeyDown}
        />
      </div>
    </div>
  );
}
