'use client';

import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { OrderSummary } from '@/types/order';
import { EmptyState } from '@/components/ui/empty-state';
import { Icons } from '@/components/icons';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatDate } from '@/lib/utils';
import Link from 'next/link';

const statusFilters = [
  { value: 'all', label: 'All Orders' },
  { value: 'pending', label: 'Pending' },
  { value: 'processing', label: 'Processing' },
  { value: 'shipped', label: 'Shipped' },
  { value: 'delivered', label: 'Delivered' },
  { value: 'cancelled', label: 'Cancelled' },
];

const EmptyOrderState = () => (
  <EmptyState
    title="No orders yet"
    description="You haven't placed any orders yet. When you do, they'll appear here."
    icon="package"
  >
    <Button asChild>
      <a href="/products">Browse Products</a>
    </Button>
  </EmptyState>
);

const OrderSkeleton = () => (
  <div className="space-y-4">
    {[1, 2, 3].map((i) => (
      <Skeleton key={i} className="h-48 w-full" />
    ))}
  </div>
);

interface OrderSummary {
  id: string;
  orderNumber: string;
  status: string;
  total: number;
  itemCount: number;
  createdAt: string;
  updatedAt: string;
}

export default function MyOrdersPage() {
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const { data: orders = [], isLoading, isError } = useQuery<OrderSummary[]>({
    queryKey: ['my-orders', statusFilter],
    queryFn: async () => {
      const params = statusFilter !== 'all' ? `?status=${statusFilter}` : '';
      const response = await api.get(`/orders${params}`);
      return response.data;
    },
  });

  if (isLoading) {
    return (
      <div className="container py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">My Orders</h1>
          <p className="text-muted-foreground">View your order history and track shipments</p>
        </div>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-48 w-full" />
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="container py-8">
        <EmptyState
          title="Error loading orders"
          description="We couldn't load your orders. Please try again later."
          icon="alertCircle"
        >
          <Button onClick={() => window.location.reload()} variant="outline">
            <Icons.refreshCw className="mr-2 h-4 w-4" />
            Try again
          </Button>
        </EmptyState>
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { label: string; variant: string }> = {
      PENDING: { label: 'Pending', variant: 'bg-yellow-100 text-yellow-800' },
      PROCESSING: { label: 'Processing', variant: 'bg-blue-100 text-blue-800' },
      SHIPPED: { label: 'Shipped', variant: 'bg-purple-100 text-purple-800' },
      DELIVERED: { label: 'Delivered', variant: 'bg-green-100 text-green-800' },
      CANCELLED: { label: 'Cancelled', variant: 'bg-red-100 text-red-800' },
      REFUNDED: { label: 'Refunded', variant: 'bg-gray-100 text-gray-800' },
    };

    const statusInfo = statusMap[status] || { label: status, variant: 'bg-gray-100 text-gray-800' };
    
    return (
      <Badge className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusInfo.variant}`}>
        {statusInfo.label}
      </Badge>
    );
  };

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">My Orders</h1>
        <p className="text-muted-foreground">View your order history and track shipments</p>
      </div>

      <Tabs defaultValue="all" className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <TabsList className="w-full sm:w-auto overflow-x-auto flex-nowrap sm:flex-wrap h-auto py-1">
            {statusFilters.map((filter) => (
              <TabsTrigger
                key={filter.value}
                value={filter.value}
                className="whitespace-nowrap"
                onClick={() => setStatusFilter(filter.value)}
              >
                {filter.label}
              </TabsTrigger>
            ))}
          </TabsList>
          
          <div className="w-full sm:w-auto">
            <Button variant="outline" className="w-full sm:w-auto" asChild>
              <Link href="/products">Continue Shopping</Link>
            </Button>
          </div>
        </div>

        <TabsContent value={statusFilter} className="space-y-6">
          {orders.length === 0 ? (
            <EmptyOrderState />
          ) : (
            <div className="space-y-6">
              {orders.map((order: any) => (
                <Card key={order.id} className="overflow-hidden">
                  <CardHeader className="bg-gray-50 p-4 border-b">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                      <div>
                        <p className="text-sm text-gray-500">Order #{order.orderNumber}</p>
                        <CardTitle className="text-lg font-semibold">
                          {new Intl.NumberFormat('en-US', {
                            style: 'currency',
                            currency: 'USD',
                          }).format(order.total)}
                        </CardTitle>
                      </div>
                      <div className="flex items-center gap-2">
                        {getStatusBadge(order.status)}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-500">Order Placed</p>
                        <p>{formatDate(order.createdAt)}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Items</p>
                        <p>{order.items?.length || 0} item{order.items?.length !== 1 ? 's' : ''}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Last Updated</p>
                        <p>{formatDate(order.updatedAt, { hour: '2-digit', minute: '2-digit' })}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Delivery</p>
                        <p className="capitalize">Standard</p>
                      </div>
                    </div>
                  </CardContent>
                  <div className="bg-gray-50 p-4 border-t flex justify-end">
                    <Button asChild variant="outline" size="sm">
                      <Link href={`/orders/${order.id}`} className="flex items-center gap-1">
                        View Order <Icons.arrowRight className="h-4 w-4 ml-1" />
                      </Link>
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
