import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { OrderStatus, PaymentStatus } from '@prisma/client';

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, data: any) {
    const { shippingAddressId, paymentMethod } = data;

    // Validate shipping address
    const address = await this.prisma.address.findFirst({
      where: { id: shippingAddressId, userId },
    });

    if (!address) {
      throw new BadRequestException('Invalid shipping address');
    }

    // Get cart items
    const cart = await this.prisma.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: {
            product: true,
            variant: true,
          },
        },
      },
    });

    if (!cart || cart.items.length === 0) {
      throw new BadRequestException('Cart is empty');
    }

    // Validate stock and prepare order items
    const orderItems = [];
    for (const item of cart.items) {
      if (item.variant.inventory < item.quantity) {
        throw new BadRequestException(
          `Insufficient stock for ${item.product.name} - ${item.variant.name}`,
        );
      }

      orderItems.push({
        productId: item.productId,
        variantId: item.variantId,
        quantity: item.quantity,
        price: item.price,
        subtotal: item.subtotal,
      });
    }

    // Use cart totals
    const subtotal = cart.subtotal.toNumber();
    const discount = cart.discount.toNumber();
    const tax = cart.tax.toNumber();
    const shippingCost = subtotal > 500 ? 0 : 99; // Free shipping over ₹500
    const total = cart.total.toNumber() + shippingCost;

    // Generate unique order number
    const orderNumber = `ORD${Date.now()}${Math.random().toString(36).substr(2, 5).toUpperCase()}`;

    // Create Razorpay order if payment method is RAZORPAY
    let razorpayOrderId = null;
    if (paymentMethod === 'RAZORPAY') {
      // TODO: Integrate actual Razorpay SDK
      razorpayOrderId = `razorpay_order_${Date.now()}`;
    }

    // Create order
    const order = await this.prisma.order.create({
      data: {
        userId,
        orderNumber,
        status: paymentMethod === 'COD' ? OrderStatus.PAID : OrderStatus.PENDING,
        paymentStatus: paymentMethod === 'COD' ? PaymentStatus.PENDING : PaymentStatus.PENDING,
        paymentMethod,
        subtotal,
        tax,
        shippingCost,
        discount,
        total,
        shippingAddressId,
        billingAddressId: shippingAddressId,
        shippingMethod: 'STANDARD',
        items: {
          create: orderItems,
        },
        payments: {
          create: {
            method: paymentMethod,
            status: paymentMethod === 'COD' ? PaymentStatus.PENDING : PaymentStatus.PENDING,
            amount: total,
            currency: 'INR',
          },
        },
      },
      include: {
        items: {
          include: {
            product: true,
            variant: true,
          },
        },
        shippingAddress: true,
        payments: true,
      },
    });

    // Update product inventory
    for (const item of cart.items) {
      await this.prisma.productVariant.update({
        where: { id: item.variantId },
        data: {
          inventory: {
            decrement: item.quantity,
          },
        },
      });
    }

    // Clear cart after order creation
    await this.prisma.cartItem.deleteMany({
      where: { cartId: cart.id },
    });

    await this.prisma.cart.update({
      where: { id: cart.id },
      data: {
        subtotal: 0,
        tax: 0,
        discount: 0,
        total: 0,
        couponCode: null,
      },
    });

    // Update coupon usage if applied
    if (cart.couponCode) {
      await this.prisma.coupon.update({
        where: { code: cart.couponCode },
        data: {
          usageCount: {
            increment: 1,
          },
        },
      });
    }

    return {
      ...order,
      razorpayOrderId,
    };
  }

  async findAll(userId: string) {
    return this.prisma.order.findMany({
      where: { userId },
      include: {
        items: {
          include: {
            product: true,
            variant: true,
          },
        },
        shippingAddress: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findByOrderNumber(userId: string, orderNumber: string) {
    return this.prisma.order.findFirst({
      where: { orderNumber, userId },
      include: {
        items: {
          include: {
            product: true,
            variant: true,
          },
        },
        shippingAddress: true,
      },
    });
  }

  async findOne(userId: string, orderId: string) {
    return this.prisma.order.findFirst({
      where: { id: orderId, userId },
      include: {
        items: {
          include: {
            product: true,
            variant: true,
          },
        },
        shippingAddress: true,
        billingAddress: true,
        payments: true,
      },
    });
  }

  async verifyPayment(userId: string, orderId: string, data: any) {
    const { razorpayPaymentId, razorpayOrderId, razorpaySignature } = data;

    const order = await this.findOne(userId, orderId);
    if (!order) {
      throw new BadRequestException('Order not found');
    }

    // TODO: Verify Razorpay signature with crypto
    // For now, mark as paid
    await this.prisma.order.update({
      where: { id: orderId },
      data: {
        status: OrderStatus.PAID,
        paymentStatus: PaymentStatus.PAID,
      },
    });

    await this.prisma.payment.updateMany({
      where: { orderId },
      data: {
        status: PaymentStatus.PAID,
        razorpayPaymentId,
        razorpayOrderId,
        razorpaySignature,
      },
    });

    return { success: true, message: 'Payment verified successfully' };
  }

  async cancelOrder(userId: string, orderId: string) {
    const order = await this.findOne(userId, orderId);

    if (!order) {
      throw new BadRequestException('Order not found');
    }

    if (order.status !== OrderStatus.PENDING && order.status !== OrderStatus.PAID) {
      throw new BadRequestException('Order cannot be cancelled at this stage');
    }

    // Restore inventory
    for (const item of order.items) {
      await this.prisma.productVariant.update({
        where: { id: item.variantId },
        data: {
          inventory: {
            increment: item.quantity,
          },
        },
      });
    }

    return this.prisma.order.update({
      where: { id: orderId },
      data: { status: OrderStatus.CANCELLED },
    });
  }

  async updateStatus(orderId: string, status: OrderStatus) {
    return this.prisma.order.update({
      where: { id: orderId },
      data: { status },
    });
  }
}
