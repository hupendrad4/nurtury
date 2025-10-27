'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Order, OrderSummary } from '@/types/order';
import { orderService } from '@/services/order.service';

interface OrderContextType {
  orders: OrderSummary[];
  loading: boolean;
  error: string | null;
  fetchOrders: () => Promise<void>;
  getOrder: (orderId: string) => Promise<Order | null>;
  cancelOrder: (orderId: string) => Promise<boolean>;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export function OrderProvider({ children }: { children: ReactNode }) {
  const [orders, setOrders] = useState<OrderSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      const userOrders = await orderService.getUserOrders();
      setOrders(userOrders);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch orders');
      console.error('Error fetching orders:', err);
    } finally {
      setLoading(false);
    }
  };

  const getOrder = async (orderId: string): Promise<Order | null> => {
    try {
      setLoading(true);
      return await orderService.getOrder(orderId);
    } catch (err) {
      console.error('Error fetching order:', err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const cancelOrder = async (orderId: string): Promise<boolean> => {
    try {
      await orderService.cancelOrder(orderId);
      await fetchOrders(); // Refresh orders list
      return true;
    } catch (err) {
      console.error('Error cancelling order:', err);
      return false;
    }
  };

  // Fetch orders on component mount
  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <OrderContext.Provider
      value={{
        orders,
        loading,
        error,
        fetchOrders,
        getOrder,
        cancelOrder,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
}

export function useOrders() {
  const context = useContext(OrderContext);
  if (context === undefined) {
    throw new Error('useOrders must be used within an OrderProvider');
  }
  return context;
}
