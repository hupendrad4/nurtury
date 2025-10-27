import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';
import Razorpay from 'razorpay';
import { PrismaService } from '../prisma/prisma.service';
import { PaymentMethod, PaymentStatus, OrderStatus } from '@prisma/client';

@Injectable()
export class PaymentsService {
  private stripe: Stripe;
  private razorpay: any;

  constructor(
    private prisma: PrismaService,
    private config: ConfigService
  ) {
    this.stripe = new Stripe(this.config.get('STRIPE_SECRET_KEY'), {
      apiVersion: '2023-10-16',
    });

    this.razorpay = new Razorpay({
      key_id: this.config.get('RAZORPAY_KEY_ID'),
      key_secret: this.config.get('RAZORPAY_KEY_SECRET'),
    });
  }

  async createStripePaymentIntent(orderId: string) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!order) {
      throw new Error('Order not found');
    }

    const paymentIntent = await this.stripe.paymentIntents.create({
      amount: Math.round(order.total.toNumber() * 100),
      currency: order.currency.toLowerCase(),
      metadata: { orderId },
    });

    await this.prisma.payment.create({
      data: {
        orderId,
        method: PaymentMethod.STRIPE,
        status: PaymentStatus.PENDING,
        amount: order.total,
        currency: order.currency,
        stripePaymentId: paymentIntent.id,
      },
    });

    return { clientSecret: paymentIntent.client_secret };
  }

  async createRazorpayOrder(orderId: string) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!order) {
      throw new Error('Order not found');
    }

    const razorpayOrder = await this.razorpay.orders.create({
      amount: Math.round(order.total.toNumber() * 100),
      currency: order.currency,
      receipt: order.orderNumber,
    });

    await this.prisma.payment.create({
      data: {
        orderId,
        method: PaymentMethod.RAZORPAY,
        status: PaymentStatus.PENDING,
        amount: order.total,
        currency: order.currency,
        razorpayOrderId: razorpayOrder.id,
      },
    });

    return razorpayOrder;
  }

  async handleStripeWebhook(signature: string, body: any) {
    const event = this.stripe.webhooks.constructEvent(
      body,
      signature,
      this.config.get('STRIPE_WEBHOOK_SECRET')
    );

    if (event.type === 'payment_intent.succeeded') {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      const orderId = paymentIntent.metadata.orderId;

      await this.prisma.payment.updateMany({
        where: { stripePaymentId: paymentIntent.id },
        data: {
          status: PaymentStatus.PAID,
          transactionId: paymentIntent.id,
        },
      });

      await this.prisma.order.update({
        where: { id: orderId },
        data: {
          paymentStatus: PaymentStatus.PAID,
          status: OrderStatus.PAID,
        },
      });
    }

    return { received: true };
  }

  async handleRazorpayWebhook(body: any) {
    // Verify signature and process webhook
    const payment = body.payload.payment.entity;

    await this.prisma.payment.updateMany({
      where: { razorpayPaymentId: payment.id },
      data: {
        status: PaymentStatus.PAID,
        transactionId: payment.id,
      },
    });

    const paymentRecord = await this.prisma.payment.findFirst({
      where: { razorpayPaymentId: payment.id },
    });

    if (paymentRecord) {
      await this.prisma.order.update({
        where: { id: paymentRecord.orderId },
        data: {
          paymentStatus: PaymentStatus.PAID,
          status: OrderStatus.PAID,
        },
      });
    }

    return { received: true };
  }
}
