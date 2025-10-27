'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { api } from '@/lib/api';

interface Order {
  id: string;
  orderNumber: string;
  status: string;
  subtotal: number;
  tax: number;
  shippingCost: number;
  total: number;
  shippingAddress: {
    fullName: string;
    phone: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    postalCode: string;
  };
  items: Array<{
    id: string;
    quantity: number;
    price: number;
    subtotal: number;
    product: {
      name: string;
      images: string;
    };
    variant: {
      name: string;
    };
  }>;
}

export default function OrderConfirmationPage() {
  const params = useParams();
  const orderNumber = params.orderNumber as string;
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await api.get(`/orders/${orderNumber}`);
        setOrder(response.data);
      } catch (error) {
        console.error('Failed to fetch order:', error);
      } finally {
        setLoading(false);
      }
    };

    if (orderNumber) {
      fetchOrder();
    }
  }, [orderNumber]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Loading order details...</div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-16">
          <div className="text-6xl mb-4">❌</div>
          <h1 className="text-3xl font-bold mb-4">Order Not Found</h1>
          <p className="text-text-light mb-8">We couldn't find the order with number {orderNumber}</p>
          <Link href="/products" className="btn-primary">
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">🎉</div>
          <h1 className="text-3xl font-bold mb-2">Order Placed Successfully!</h1>
          <p className="text-text-light">
            Thank you for shopping with QuoriumAgro. Your order has been confirmed.
          </p>
        </div>

        {/* Order Details Card */}
        <div className="card p-6 mb-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-xl font-bold mb-2">Order #{order.orderNumber}</h2>
              <p className="text-text-light">Placed on {new Date().toLocaleDateString()}</p>
            </div>
            <div className="text-right">
              <div className="text-sm text-text-light mb-1">Order Status</div>
              <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                {order.status}
              </span>
            </div>
          </div>

          {/* Delivery Address */}
          <div className="mb-6">
            <h3 className="font-semibold mb-3">Delivery Address</h3>
            <div className="text-text-light">
              <p className="font-medium text-gray-900">{order.shippingAddress.fullName}</p>
              <p>{order.shippingAddress.phone}</p>
              <p>{order.shippingAddress.addressLine1}</p>
              {order.shippingAddress.addressLine2 && <p>{order.shippingAddress.addressLine2}</p>}
              <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}</p>
              <p>{order.shippingAddress.country}</p>
            </div>
          </div>

          {/* Order Items */}
          <div className="mb-6">
            <h3 className="font-semibold mb-3">Order Items</h3>
            <div className="space-y-3">
              {order.items.map((item) => {
                const images = JSON.parse(item.product.images || '[]');
                return (
                  <div key={item.id} className="flex gap-4 p-3 bg-gray-50 rounded-lg">
                    <div className="relative w-16 h-16 rounded overflow-hidden">
                      <Image
                        src={images[0]?.url || '/placeholder.png'}
                        alt={item.product.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium">{item.product.name}</h4>
                      <p className="text-sm text-text-light">{item.variant.name}</p>
                      <p className="text-sm">Quantity: {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">₹{item.subtotal}</div>
                      <div className="text-sm text-text-light">₹{item.price} each</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Price Breakdown */}
          <div className="border-t pt-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>₹{order.subtotal}</span>
              </div>
              <div className="flex justify-between">
                <span>GST (18%)</span>
                <span>₹{order.tax}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>{order.shippingCost === 0 ? 'FREE' : `₹${order.shippingCost}`}</span>
              </div>
              <hr />
              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span>₹{order.total}</span>
              </div>
            </div>
          </div>
        </div>

        {/* What's Next */}
        <div className="card p-6 mb-6">
          <h3 className="text-lg font-bold mb-4">What's Next?</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-sm font-bold">1</div>
              <div>
                <div className="font-medium">Order Confirmation</div>
                <div className="text-sm text-text-light">You'll receive an email confirmation shortly</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gray-200 text-gray-600 rounded-full flex items-center justify-center text-sm font-bold">2</div>
              <div>
                <div className="font-medium">Order Processing</div>
                <div className="text-sm text-text-light">We'll process your order within 24 hours</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gray-200 text-gray-600 rounded-full flex items-center justify-center text-sm font-bold">3</div>
              <div>
                <div className="font-medium">Shipping</div>
                <div className="text-sm text-text-light">Your order will be shipped within 2-3 business days</div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/products" className="btn-primary text-center">
            Continue Shopping
          </Link>
          <Link href="/orders" className="btn-secondary text-center">
            View All Orders
          </Link>
        </div>

        {/* Help Section */}
        <div className="text-center mt-8 pt-8 border-t">
          <p className="text-text-light mb-4">
            Need help with your order? Contact our customer support
          </p>
          <div className="flex justify-center gap-6 text-sm">
            <a href="mailto:support@quoriumagro.com" className="text-primary hover:underline">
              📧 support@quoriumagro.com
            </a>
            <a href="tel:+919876543210" className="text-primary hover:underline">
              📞 +91 98765 43210
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
