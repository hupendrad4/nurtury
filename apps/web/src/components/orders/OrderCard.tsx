import Link from 'next/link';
import { OrderSummary } from '@/types/order';
import { formatDate } from '@/utils/date';
import { Badge } from '../ui/badge';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { ArrowRight, Package, Truck, CheckCircle, XCircle, Clock } from 'lucide-react';

const statusIcons = {
  pending: <Clock className="h-4 w-4" />,
  processing: <Package className="h-4 w-4" />,
  shipped: <Truck className="h-4 w-4" />,
  delivered: <CheckCircle className="h-4 w-4" />,
  cancelled: <XCircle className="h-4 w-4" />,
};

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800',
  processing: 'bg-blue-100 text-blue-800',
  shipped: 'bg-purple-100 text-purple-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
};

interface OrderCardProps {
  order: OrderSummary;
}

export function OrderCard({ order }: OrderCardProps) {
  const status = order.status.toLowerCase() as keyof typeof statusIcons;
  
  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      <CardHeader className="bg-gray-50 p-4 border-b">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
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
            <Badge className={`${statusColors[status] || 'bg-gray-100 text-gray-800'} flex items-center gap-1`}>
              {statusIcons[status] || null}
              <span className="capitalize">{order.status}</span>
            </Badge>
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
            <p>{order.itemCount} item{order.itemCount !== 1 ? 's' : ''}</p>
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
      <CardFooter className="bg-gray-50 p-4 border-t flex justify-end">
        <Button asChild variant="outline" size="sm">
          <Link href={`/orders/${order.id}`} className="flex items-center gap-1">
            View Order <ArrowRight className="h-4 w-4 ml-1" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
