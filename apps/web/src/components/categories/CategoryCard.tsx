import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface CategoryCardProps {
  id: string;
  name: string;
  image: string;
  slug: string;
  parentCategory?: string;
  className?: string;
  showParent?: boolean;
}

export function CategoryCard({ 
  id, 
  name, 
  image, 
  slug, 
  parentCategory, 
  className,
  showParent = true 
}: CategoryCardProps) {
  return (
    <Link 
      href={`/categories/${slug}`} 
      className={cn("group block h-full", className)}
    >
      <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 h-full flex flex-col border border-gray-100">
        <div className="relative aspect-square w-full">
          <Image
            src={image}
            alt={name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority={false}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
            <span className="text-white font-medium">Shop Now →</span>
          </div>
        </div>
        <div className="p-4 flex-1 flex flex-col">
          {showParent && parentCategory && (
            <span className="text-xs font-medium text-primary mb-1">{parentCategory}</span>
          )}
          <h3 className="text-lg font-semibold text-gray-900 group-hover:text-primary transition-colors line-clamp-2">
            {name}
          </h3>
          
          {!showParent && parentCategory && (
            <div className="mt-1">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                {parentCategory}
              </span>
            </div>
          )}
          
          <div className="mt-2 text-sm text-gray-500 line-clamp-2">
            Explore our collection of {name.toLowerCase()}
          </div>
        </div>
      </div>
    </Link>
  );
}
