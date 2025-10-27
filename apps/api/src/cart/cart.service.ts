import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CartService {
  constructor(private prisma: PrismaService) {}

  async getCart(userId: string) {
    let cart = await this.prisma.cart.findUnique({
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

    if (!cart) {
      cart = await this.prisma.cart.create({
        data: { userId },
        include: {
          items: {
            include: {
              product: true,
              variant: true,
            },
          },
        },
      });
    }

    return cart;
  }

  async addItem(userId: string, variantId: string, quantity: number) {
    const cart = await this.getCart(userId);
    const variant = await this.prisma.productVariant.findUnique({
      where: { id: variantId },
      include: { product: true },
    });

    if (!variant) {
      throw new Error('Variant not found');
    }

    const existingItem = await this.prisma.cartItem.findUnique({
      where: { cartId_variantId: { cartId: cart.id, variantId } },
    });

    if (existingItem) {
      await this.prisma.cartItem.update({
        where: { id: existingItem.id },
        data: {
          quantity: existingItem.quantity + quantity,
          subtotal: variant.price.toNumber() * (existingItem.quantity + quantity),
        },
      });
    } else {
      await this.prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productId: variant.productId,
          variantId,
          quantity,
          price: variant.price,
          subtotal: variant.price.toNumber() * quantity,
        },
      });
    }

    return this.updateCartTotals(cart.id);
  }

  async updateItem(userId: string, itemId: string, quantity: number) {
    const item = await this.prisma.cartItem.findFirst({
      where: { id: itemId, cart: { userId } },
      include: { variant: true },
    });

    if (!item) {
      throw new Error('Cart item not found');
    }

    await this.prisma.cartItem.update({
      where: { id: itemId },
      data: {
        quantity,
        subtotal: item.variant.price.toNumber() * quantity,
      },
    });

    return this.updateCartTotals(item.cartId);
  }

  async removeItem(userId: string, itemId: string) {
    const item = await this.prisma.cartItem.findFirst({
      where: { id: itemId, cart: { userId } },
    });

    if (!item) {
      throw new Error('Cart item not found');
    }

    await this.prisma.cartItem.delete({ where: { id: itemId } });
    return this.updateCartTotals(item.cartId);
  }

  async clearCart(userId: string) {
    const cart = await this.getCart(userId);
    await this.prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
    return this.updateCartTotals(cart.id);
  }

  private async updateCartTotals(cartId: string) {
    const cart = await this.prisma.cart.findUnique({
      where: { id: cartId },
      include: { items: true },
    });

    const subtotal = cart.items.reduce((sum, item) => sum + item.subtotal.toNumber(), 0);
    let discount = 0;

    // Apply coupon if exists
    if (cart.couponCode) {
      const coupon = await this.prisma.coupon.findUnique({
        where: { code: cart.couponCode },
      });

      if (coupon && coupon.isActive && new Date() >= coupon.validFrom && new Date() <= coupon.validUntil) {
        if (subtotal >= (coupon.minPurchaseAmount?.toNumber() || 0)) {
          if (coupon.discountType === 'PERCENTAGE') {
            discount = subtotal * (coupon.discountValue.toNumber() / 100);
            if (coupon.maxDiscountAmount) {
              discount = Math.min(discount, coupon.maxDiscountAmount.toNumber());
            }
          } else {
            discount = coupon.discountValue.toNumber();
          }
        }
      }
    }

    const discountedSubtotal = subtotal - discount;
    const tax = discountedSubtotal * 0.18; // 18% GST
    const total = discountedSubtotal + tax;

    return this.prisma.cart.update({
      where: { id: cartId },
      data: { subtotal, tax, discount, total },
      include: {
        items: {
          include: {
            product: true,
            variant: true,
          },
        },
      },
    });
  }

  async applyCoupon(userId: string, code: string) {
    const cart = await this.getCart(userId);
    const coupon = await this.prisma.coupon.findUnique({
      where: { code: code.toUpperCase() },
    });

    if (!coupon) {
      throw new Error('Invalid coupon code');
    }

    if (!coupon.isActive) {
      throw new Error('This coupon is no longer active');
    }

    const now = new Date();
    if (now < coupon.validFrom || now > coupon.validUntil) {
      throw new Error('This coupon has expired');
    }

    if (coupon.usageLimit && coupon.usageCount >= coupon.usageLimit) {
      throw new Error('This coupon has reached its usage limit');
    }

    const items = await this.prisma.cartItem.findMany({
      where: { cartId: cart.id },
    });
    const subtotal = items.reduce((sum, item) => sum + item.subtotal.toNumber(), 0);

    if (coupon.minPurchaseAmount && subtotal < coupon.minPurchaseAmount.toNumber()) {
      throw new Error(`Minimum purchase amount of ₹${coupon.minPurchaseAmount} required`);
    }

    await this.prisma.cart.update({
      where: { id: cart.id },
      data: { couponCode: code.toUpperCase() },
    });

    return this.updateCartTotals(cart.id);
  }

  async removeCoupon(userId: string) {
    const cart = await this.getCart(userId);
    await this.prisma.cart.update({
      where: { id: cart.id },
      data: { couponCode: null },
    });
    return this.updateCartTotals(cart.id);
  }
}
