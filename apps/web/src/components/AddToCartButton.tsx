'use client';

import { useState } from 'react';
import { useCart } from '@/lib/cart-context';

interface AddToCartButtonProps {
  variantId: string;
  productName: string;
  price: number;
  disabled?: boolean;
  simple?: boolean; // Simple mode for product cards
  className?: string;
}

export function AddToCartButton({ variantId, productName, price, disabled, simple = false, className = '' }: AddToCartButtonProps) {
  const { addToCart, loading } = useCart();
  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = async () => {
    try {
      await addToCart(variantId, simple ? 1 : quantity);
      console.log(`Added ${simple ? 1 : quantity} x ${productName} to cart`);
    } catch (error) {
      console.error('Failed to add to cart:', error);
    }
  };

  // Simple mode - just a button (for product cards)
  if (simple) {
    return (
      <button
        onClick={handleAddToCart}
        disabled={disabled || loading}
        className={`w-full bg-primary text-white px-4 py-2.5 rounded-lg font-semibold hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 ${className}`}
      >
        {loading ? (
          <>
            <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Adding...
          </>
        ) : (
          <>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            Add to Cart
          </>
        )}
      </button>
    );
  }

  // Full mode - with quantity selector (for product details page)
  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center border rounded-lg">
        <button
          onClick={() => setQuantity(Math.max(1, quantity - 1))}
          className="px-3 py-2 hover:bg-gray-100 transition-colors"
          disabled={disabled}
        >
          −
        </button>
        <span className="px-3 py-2 min-w-[3rem] text-center">{quantity}</span>
        <button
          onClick={() => setQuantity(quantity + 1)}
          className="px-3 py-2 hover:bg-gray-100 transition-colors"
          disabled={disabled}
        >
          +
        </button>
      </div>

      <button
        onClick={handleAddToCart}
        disabled={disabled || loading}
        className="flex-1 bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Adding...' : `Add to Cart - ₹${price * quantity}`}
      </button>
    </div>
  );
}
