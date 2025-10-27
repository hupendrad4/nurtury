import { api } from '@/lib/api';
import { CreateOrderInput, Order, OrderSummary, UpdateOrderStatusInput } from '@/types/order';

class OrderService {
  private basePath = '/orders';

  async createOrder(orderData: CreateOrderInput): Promise<Order> {
    const response = await api.post(this.basePath, orderData);
    return response.data;
  }

  async getOrder(orderId: string): Promise<Order> {
    const response = await api.get(`${this.basePath}/${orderId}`);
    return response.data;
  }

  async getOrderByNumber(orderNumber: string): Promise<Order> {
    const response = await api.get(`${this.basePath}/number/${orderNumber}`);
    return response.data;
  }

  async getUserOrders(): Promise<OrderSummary[]> {
    const response = await api.get(`${this.basePath}/my-orders`);
    return response.data;
  }

  async updateOrderStatus(
    orderId: string,
    statusData: UpdateOrderStatusInput
  ): Promise<Order> {
    const response = await api.patch(
      `${this.basePath}/${orderId}/status`,
      statusData
    );
    return response.data;
  }

  async cancelOrder(orderId: string): Promise<Order> {
    const response = await api.post(`${this.basePath}/${orderId}/cancel`);
    return response.data;
  }

  // Admin only
  async getAllOrders(params?: {
    status?: string;
    page?: number;
    limit?: number;
  }): Promise<{ data: OrderSummary[]; total: number }> {
    const response = await api.get(this.basePath, { params });
    return response.data;
  }
}

export const orderService = new OrderService();
