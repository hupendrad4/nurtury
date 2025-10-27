'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { AddToCartButton } from './AddToCartButton';

interface ProductCardProps {
  product: any;
}

export function ProductCard({ product }: ProductCardProps) {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const images = JSON.parse(product.images || '[]');
  const defaultVariant = product.variants?.[0];
  const discount = product.compareAtPrice
    ? Math.round(((product.compareAtPrice - product.basePrice) / product.compareAtPrice) * 100)
    : 0;

  const badges = [];
  if (product.isBestseller) badges.push({ label: 'Bestseller', color: 'bg-orange-500' });
  if (product.isNewArrival) badges.push({ label: 'New', color: 'bg-blue-500' });
  if (discount > 0) badges.push({ label: `${discount}% OFF`, color: 'bg-red-500' });
  if (product.stock < 10 && product.stock > 0) badges.push({ label: 'Only ' + product.stock + ' left', color: 'bg-yellow-500' });
  if (product.isMedicinal) badges.push({ label: 'Medicinal', color: 'bg-green-500' });

  const toggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsWishlisted(!isWishlisted);
    // TODO: API call to add/remove from wishlist
  };

  return (
    <div className="card hover:shadow-xl transition-all duration-300 group overflow-hidden border bg-white relative">
      <Link href={`/products/${product.slug}`} className="block">
        {/* Image Container */}
        <div className="relative h-56 overflow-hidden bg-gray-50">
          <Image
            src={images[0]?.url || '/placeholder.png'}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-300"
          />

          {/* Badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            {badges.slice(0, 2).map((badge, idx) => (
              <span
                key={idx}
                className={`${badge.color} text-white px-2 py-1 rounded text-xs font-bold shadow-sm`}
              >
                {badge.label}
              </span>
            ))}
          </div>

          {/* Wishlist Button */}
          <button
            onClick={toggleWishlist}
            className="absolute top-2 right-2 w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center hover:bg-red-50 transition-colors z-10"
          >
            <svg
              className={`w-5 h-5 ${isWishlisted ? 'text-red-500 fill-current' : 'text-gray-400'}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
          </button>

          {/* Stock Status */}
          {product.stock === 0 && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <span className="bg-white px-4 py-2 rounded font-bold text-gray-800">Out of Stock</span>
            </div>
          )}

          {/* Quick View Overlay */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
        </div>

        {/* Product Info */}
        <div className="p-4">
          {/* Category & Rating */}
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded font-medium">
              {product.category?.name}
            </span>
            <div className="flex items-center gap-1">
              <span className="text-yellow-500 text-sm">★</span>
              <span className="text-sm font-medium">{product.rating || '4.5'}</span>
              <span className="text-xs text-gray-500">({product.reviewCount || 0})</span>
            </div>
          </div>

          {/* Product Name */}
          <h3 className="font-semibold text-gray-800 mb-2 line-clamp-2 group-hover:text-primary transition-colors min-h-[2.5rem]">
            {product.name}
          </h3>

          {/* Description */}
          <p className="text-sm text-gray-600 mb-3 line-clamp-2 min-h-[2.5rem]">
            {product.description || 'Premium quality plant for your garden'}
          </p>

          {/* Price Section */}
          <div className="mb-3">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-gray-900">
                ₹{product.basePrice?.toLocaleString()}
              </span>
              {product.compareAtPrice && (
                <span className="text-sm text-gray-500 line-through">
                  ₹{product.compareAtPrice?.toLocaleString()}
                </span>
              )}
            </div>
            {discount > 0 && (
              <span className="text-sm text-green-600 font-medium">
                Save ₹{(product.compareAtPrice - product.basePrice).toLocaleString()}
              </span>
            )}
          </div>

          {/* Delivery Info */}
          <div className="flex items-center gap-2 text-xs text-gray-600 mb-3 pb-3 border-b">
            <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span>Free delivery on orders above ₹499</span>
          </div>

          {/* Size/Variant Options */}
          {product.variants && product.variants.length > 1 && (
            <div className="mb-3">
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-600">Available in:</span>
                <div className="flex gap-1">
                  {product.variants.slice(0, 3).map((variant: any, idx: number) => (
                    <span key={idx} className="text-xs bg-gray-100 px-2 py-1 rounded">
                      {variant.size || variant.name}
                    </span>
                  ))}
                  {product.variants.length > 3 && (
                    <span className="text-xs text-gray-500">+{product.variants.length - 3}</span>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </Link>

      {/* Add to Cart Button */}
      <div className="px-4 pb-4">
        {defaultVariant ? (
          <AddToCartButton
            variantId={defaultVariant.id}
            productName={product.name}
            price={defaultVariant.price || product.basePrice}
            disabled={product.stock === 0}
            simple={true}
          />
        ) : (
          <Link
            href={`/products/${product.slug}`}
            className="w-full bg-primary text-white px-6 py-2 rounded-lg font-semibold hover:bg-primary-dark transition-colors text-center block"
          >
            View Options
          </Link>
        )}
      </div>

      {/* Trust Badge */}
      <div className="px-4 pb-3 flex items-center justify-center gap-2 text-xs text-gray-500">
        <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
        <span>Quality Guaranteed</span>
      </div>
    </div>
  );
}

