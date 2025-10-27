'use client';

import { createContext, useContext, useState, useMemo, ReactNode } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { useRouter } from 'next/navigation';

interface CartItem {
  id: string;
  quantity: number;
  price: number;
  subtotal: number;
  product: {
    id: string;
    name: string;
    slug: string;
    images: string[];
  };
  variant: {
    id: string;
    name: string;
    sku: string;
    inventory: number;
  };
}

interface Cart {
  id: string;
  items: CartItem[];
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  couponCode?: string;
}

interface CartContextType {
  cart: Cart | null;
  itemCount: number;
  loading: boolean;
  isAuthenticated: boolean;
  addToCart: (variantId: string, quantity: number) => Promise<void>;
  updateQuantity: (itemId: string, quantity: number) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
  applyCoupon: (code: string) => Promise<void>;
  removeCoupon: () => Promise<void>;
  clearCart: () => Promise<void>;
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [showErrorToast, setShowErrorToast] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const queryClient = useQueryClient();
  const router = useRouter();

  // Check if user is authenticated
  const isAuthenticated = typeof window !== 'undefined' && !!localStorage.getItem('accessToken');

  // Fetch cart data
  const { data: cart, isLoading } = useQuery<Cart>({
    queryKey: ['cart'],
    queryFn: async () => {
      if (!isAuthenticated) {
        return null;
      }
      try {
        const response = await api.get('/cart');
        return response.data;
      } catch (error: any) {
        if (error.response?.status === 401) {
          // User not logged in, return empty cart
          return null;
        }
        throw error;
      }
    },
    enabled: isAuthenticated,
    retry: false,
  });

  const itemCount = cart?.items.reduce((sum, item) => sum + item.quantity, 0) || 0;

  const showError = (message: string) => {
    setErrorMessage(message);
    setShowErrorToast(true);
    setTimeout(() => setShowErrorToast(false), 4000);
  };

  const checkAuthAndRedirect = () => {
    if (!isAuthenticated) {
      showError('Please login to add items to cart');
      setTimeout(() => {
        router.push('/login?redirect=/products');
      }, 1500);
      return false;
    }
    return true;
  };

  // Add to cart mutation
  const addToCartMutation = useMutation({
    mutationFn: ({ variantId, quantity }: { variantId: string; quantity: number }) => {
      if (!checkAuthAndRedirect()) {
        throw new Error('Not authenticated');
      }
      return api.post('/cart/items', { variantId, quantity });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      setShowSuccessToast(true);
      setTimeout(() => setShowSuccessToast(false), 3000);
    },
    onError: (error: any) => {
      console.error('Add to cart error:', error);
      if (error.response?.status === 401) {
        showError('Please login to add items to cart');
        setTimeout(() => {
          router.push('/login?redirect=/products');
        }, 1500);
      } else {
        showError(error.response?.data?.message || 'Failed to add item to cart');
      }
    },
  });

  // Update quantity mutation
  const updateQuantityMutation = useMutation({
    mutationFn: ({ itemId, quantity }: { itemId: string; quantity: number }) =>
      api.put(`/cart/items/${itemId}`, { quantity }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
    onError: (error: any) => {
      showError(error.response?.data?.message || 'Failed to update quantity');
    },
  });

  // Remove item mutation
  const removeItemMutation = useMutation({
    mutationFn: (itemId: string) => api.delete(`/cart/items/${itemId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
    onError: (error: any) => {
      showError(error.response?.data?.message || 'Failed to remove item');
    },
  });

  // Apply coupon mutation
  const applyCouponMutation = useMutation({
    mutationFn: (code: string) => api.post('/cart/coupon', { code }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
    onError: (error: any) => {
      showError(error.response?.data?.message || 'Invalid coupon code');
    },
  });

  // Remove coupon mutation
  const removeCouponMutation = useMutation({
    mutationFn: () => api.delete('/cart/coupon'),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });

  // Clear cart mutation
  const clearCartMutation = useMutation({
    mutationFn: () => api.delete('/cart'),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });

  const addToCart = async (variantId: string, quantity: number) => {
    await addToCartMutation.mutateAsync({ variantId, quantity });
  };

  const updateQuantity = async (itemId: string, quantity: number) => {
    await updateQuantityMutation.mutateAsync({ itemId, quantity });
  };

  const removeItem = async (itemId: string) => {
    await removeItemMutation.mutateAsync(itemId);
  };

  const applyCoupon = async (code: string) => {
    await applyCouponMutation.mutateAsync(code);
  };

  const removeCoupon = async () => {
    await removeCouponMutation.mutateAsync();
  };

  const clearCart = async () => {
    await clearCartMutation.mutateAsync();
  };

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);

  const contextValue = useMemo(
    () => ({
      cart,
      itemCount,
      loading: isLoading || addToCartMutation.isPending,
      isAuthenticated,
      addToCart,
      updateQuantity,
      removeItem,
      applyCoupon,
      removeCoupon,
      clearCart,
      isCartOpen,
      openCart,
      closeCart,
    }),
    [cart, itemCount, isLoading, addToCartMutation.isPending, isCartOpen, isAuthenticated]
  );

  return (
    <CartContext.Provider value={contextValue}>
      {children}

      {/* Success Toast */}
      {showSuccessToast && (
        <div className="fixed top-20 right-4 z-50 animate-slide-in-right">
          <div className="bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-3">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span className="font-medium">Added to cart successfully!</span>
          </div>
        </div>
      )}

      {/* Error Toast */}
      {showErrorToast && (
        <div className="fixed top-20 right-4 z-50 animate-slide-in-right">
          <div className="bg-red-600 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-3">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="font-medium">{errorMessage}</span>
          </div>
        </div>
      )}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}

