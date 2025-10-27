import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CouponsService {
  constructor(private prisma: PrismaService) {}

  async validate(code: string, amount: number) {
    const coupon = await this.prisma.coupon.findFirst({
      where: {
        code,
        isActive: true,
        validFrom: { lte: new Date() },
        validUntil: { gte: new Date() },
      },
    });

    if (!coupon) {
      throw new Error('Invalid coupon code');
    }

    if (coupon.usageLimit && coupon.usageCount >= coupon.usageLimit) {
      throw new Error('Coupon usage limit reached');
    }

    if (coupon.minPurchaseAmount && amount < coupon.minPurchaseAmount.toNumber()) {
      throw new Error(`Minimum purchase amount is ${coupon.minPurchaseAmount}`);
    }

    let discount = 0;
    if (coupon.discountType === 'PERCENTAGE') {
      discount = (amount * coupon.discountValue.toNumber()) / 100;
      if (coupon.maxDiscountAmount) {
        discount = Math.min(discount, coupon.maxDiscountAmount.toNumber());
      }
    } else {
      discount = coupon.discountValue.toNumber();
    }

    return { coupon, discount };
  }
}
