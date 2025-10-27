import Image from 'next/image';
import Link from 'next/link';
import { Star } from 'lucide-react';

export interface ProductCardProps {
  product: {
    id: string;
    name: string;
    price: number;
    image: string;
    rating?: number;
    reviewCount?: number;
    category?: string;
  };
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <Link href={`/products/${product.id}`} className="group">
      <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 h-full flex flex-col">
        <div className="relative aspect-square w-full">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
          />
        </div>
        <div className="p-4 flex-1 flex flex-col">
          <h3 className="font-medium text-gray-900 group-hover:text-primary transition-colors line-clamp-2">
            {product.name}
          </h3>
          
          <div className="mt-2 flex items-center">
            {product.rating !== undefined && (
              <div className="flex items-center">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`h-4 w-4 ${
                        star <= Math.round(product.rating || 0)
                          ? 'text-yellow-400 fill-current'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                {product.reviewCount && (
                  <span className="ml-1 text-sm text-gray-500">
                    ({product.reviewCount})
                  </span>
                )}
              </div>
            )}
          </div>
          
          <div className="mt-2 font-semibold text-gray-900">
            ${product.price.toFixed(2)}
          </div>
          
          <button
            className="mt-4 w-full bg-primary text-white py-2 px-4 rounded-md hover:bg-primary/90 transition-colors text-sm font-medium"
            onClick={(e) => {
              e.preventDefault();
              // Add to cart logic would go here
            }}
          >
            Add to Cart
          </button>
        </div>
      </div>
    </Link>
  );
}
