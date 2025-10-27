'use client';

import { createContext, useContext, useState, useMemo, ReactNode, useEffect } from 'react';
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
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  // Initialize cart state from localStorage for guest users
  const [guestCart, setGuestCart] = useState<Cart>(() => {
    if (typeof window === 'undefined') {
      return {
        id: 'guest-cart',
        items: [],
        subtotal: 0,
        tax: 0,
        discount: 0,
        total: 0
      };
    }
    const savedCart = localStorage.getItem('guestCart');
    return savedCart 
      ? JSON.parse(savedCart) 
      : {
          id: 'guest-cart',
          items: [],
          subtotal: 0,
          tax: 0,
          discount: 0,
          total: 0
        };
  });
  
  // Save guest cart to localStorage when it changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('guestCart', JSON.stringify(guestCart));
    }
  }, [guestCart]);
  
  // Check authentication status on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('accessToken');
      setIsAuthenticated(!!token);
    }
  }, []);

  // Fetch cart data
  const { data: serverCart, isLoading } = useQuery<Cart>({
    queryKey: ['cart'],
    queryFn: async () => {
      if (!isAuthenticated) {
        return guestCart;
      }
      try {
        const response = await api.get('/cart');
        return response.data;
      } catch (error: any) {
        if (error.response?.status === 401) {
          // If auth fails, fall back to guest cart
          setIsAuthenticated(false);
          return guestCart;
        }
        throw error;
      }
    },
    initialData: guestCart,
    retry: false,
  });
  
  // Use server cart for authenticated users, guest cart for guests
  const cart = isAuthenticated ? serverCart : guestCart;

  const itemCount = useMemo(() => {
    return cart?.items.reduce((sum, item) => sum + item.quantity, 0) || 0;
  }, [cart]);

  const showError = (message: string) => {
    setErrorMessage(message);
    setShowErrorToast(true);
    setTimeout(() => setShowErrorToast(false), 4000);
  };

  // No longer need to force login for adding to cart
  const checkAuthAndRedirect = () => {
    // Always return true since we support guest checkout
    return true;
  };

  // Add to cart mutation
  const addToCartMutation = useMutation({
    mutationFn: async ({ variantId, quantity }: { variantId: string; quantity: number }) => {
      if (isAuthenticated) {
        return api.post('/cart/items', { variantId, quantity });
      } else {
        // For guest users, update the guest cart in local storage
        const product = (await import('@/data/mockProducts')).mockProducts.find((p: any) => p.id === variantId);
        if (!product) throw new Error('Product not found');
        
        const existingItemIndex = guestCart.items.findIndex(item => item.id === variantId);
        let updatedItems;
        
        if (existingItemIndex >= 0) {
          updatedItems = [...guestCart.items];
          updatedItems[existingItemIndex] = {
            ...updatedItems[existingItemIndex],
            quantity: updatedItems[existingItemIndex].quantity + quantity,
            subtotal: (updatedItems[existingItemIndex].price * (updatedItems[existingItemIndex].quantity + quantity))
          };
        } else {
          const newItem = {
            id: variantId,
            quantity,
            price: product.price,
            subtotal: product.price * quantity,
            product: {
              id: product.id,
              name: product.name,
              slug: product.slug,
              images: product.images
            },
            variant: {
              id: variantId,
              name: 'Default',
              sku: `SKU-${variantId}`,
              inventory: 100
            }
          };
          updatedItems = [...guestCart.items, newItem];
        }
        
        const subtotal = updatedItems.reduce((sum, item) => sum + item.subtotal, 0);
        const tax = subtotal * 0.1; // 10% tax for example
        const total = subtotal + tax;
        
        const updatedCart = {
          ...guestCart,
          items: updatedItems,
          subtotal,
          tax,
          total
        };
        
        setGuestCart(updatedCart);
        return { data: updatedCart };
      }
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

