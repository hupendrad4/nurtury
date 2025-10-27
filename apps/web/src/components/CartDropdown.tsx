'use client';

import { useCart } from '@/lib/cart-context';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export function CartDropdown() {
  const { cart, itemCount, isCartOpen, closeCart, removeItem, updateQuantity } = useCart();
  const router = useRouter();

  if (!isCartOpen) return null;

  const handleCheckout = () => {
    closeCart();
    router.push('/checkout');
  };

  const handleViewCart = () => {
    closeCart();
    router.push('/cart');
  };

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/20 z-40"
        onClick={closeCart}
      />

      {/* Cart Sidebar */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl z-50 flex flex-col animate-slide-in-right">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-bold">Shopping Cart ({itemCount})</h2>
          <button
            onClick={closeCart}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-4">
          {!cart || itemCount === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-500">
              <svg className="w-24 h-24 mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              <p className="text-lg font-medium mb-2">Your cart is empty</p>
              <p className="text-sm mb-4">Add some plants to get started!</p>
              <button
                onClick={closeCart}
                className="text-primary hover:text-primary-dark font-medium"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {cart.items.map((item) => {
                const image = Array.isArray(item.product.images)
                  ? item.product.images[0]
                  : '/placeholder-plant.jpg';

                return (
                  <div key={item.id} className="flex gap-3 pb-4 border-b">
                    <img
                      src={image}
                      alt={item.product.name}
                      className="w-20 h-20 object-cover rounded-lg"
                      onError={(e) => {
                        e.currentTarget.src = '/placeholder-plant.jpg';
                      }}
                    />

                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-sm truncate">{item.product.name}</h3>
                      <p className="text-xs text-gray-600">{item.variant.name}</p>

                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center border rounded">
                          <button
                            onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                            className="px-2 py-1 hover:bg-gray-100 text-sm"
                          >
                            −
                          </button>
                          <span className="px-2 py-1 text-sm min-w-[2rem] text-center">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="px-2 py-1 hover:bg-gray-100 text-sm"
                            disabled={item.quantity >= item.variant.inventory}
                          >
                            +
                          </button>
                        </div>

                        <div className="text-right">
                          <p className="font-bold text-primary">₹{item.subtotal.toFixed(2)}</p>
                          <button
                            onClick={() => removeItem(item.id)}
                            className="text-xs text-red-600 hover:text-red-700"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        {cart && itemCount > 0 && (
          <div className="border-t p-4 space-y-3 bg-gray-50">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium">₹{cart.subtotal.toFixed(2)}</span>
              </div>
              {cart.discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Discount</span>
                  <span className="font-medium">-₹{cart.discount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-gray-600">Tax (GST)</span>
                <span className="font-medium">₹{cart.tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-lg font-bold pt-2 border-t">
                <span>Total</span>
                <span className="text-primary">₹{cart.total.toFixed(2)}</span>
              </div>
            </div>

            <div className="space-y-2">
              <button
                onClick={handleCheckout}
                className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-primary-dark transition-colors"
              >
                Proceed to Checkout
              </button>
              <button
                onClick={handleViewCart}
                className="w-full border-2 border-primary text-primary py-3 rounded-lg font-semibold hover:bg-primary hover:text-white transition-colors"
              >
                View Cart
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

