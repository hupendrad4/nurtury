import { Controller, Post, Body, Headers, RawBodyRequest, Req } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { PaymentsService } from './payments.service';

@ApiTags('payments')
@Controller('payments')
export class PaymentsController {
  constructor(private paymentsService: PaymentsService) {}

  @Post('stripe/create-intent')
  @ApiOperation({ summary: 'Create Stripe payment intent' })
  createStripeIntent(@Body() body: { orderId: string }) {
    return this.paymentsService.createStripePaymentIntent(body.orderId);
  }

  @Post('razorpay/create-order')
  @ApiOperation({ summary: 'Create Razorpay order' })
  createRazorpayOrder(@Body() body: { orderId: string }) {
    return this.paymentsService.createRazorpayOrder(body.orderId);
  }

  @Post('webhooks/stripe')
  @ApiOperation({ summary: 'Stripe webhook' })
  stripeWebhook(@Headers('stripe-signature') signature: string, @Req() req: RawBodyRequest<Request>) {
    return this.paymentsService.handleStripeWebhook(signature, req.rawBody);
  }

  @Post('webhooks/razorpay')
  @ApiOperation({ summary: 'Razorpay webhook' })
  razorpayWebhook(@Body() body: any) {
    return this.paymentsService.handleRazorpayWebhook(body);
  }
}
