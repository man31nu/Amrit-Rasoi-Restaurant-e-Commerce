import { Component, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CartService, AuthService, OrderService, CouponService, ToastService } from '@services';
import { AppliedCoupon } from '@models';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CartComponent {
  cartService = inject(CartService);
  private authService = inject(AuthService);
  private orderService = inject(OrderService);
  private couponService = inject(CouponService);
  private toast = inject(ToastService);

  checkoutLoading = signal<boolean>(false);
  couponCode = signal<string>('');
  couponLoading = signal<boolean>(false);
  appliedCoupon = signal<AppliedCoupon | null>(null);

  subtotal(): number {
    return this.cartService.totalAmount();
  }

  discountAmount(): number {
    const coupon = this.appliedCoupon();
    if (!coupon) return 0;
    // Re-verify if subtotal still meets min order amount
    if (this.subtotal() < coupon.minOrderAmount) {
      return 0;
    }
    const calculated = (this.subtotal() * coupon.discountPercent) / 100;
    return Number(calculated.toFixed(2));
  }

  deliveryFee(): number {
    const amtAfterDiscount = this.subtotal() - this.discountAmount();
    return amtAfterDiscount > 500 ? 0 : (amtAfterDiscount > 0 ? 50 : 0);
  }

  total(): number {
    return Number((this.subtotal() - this.discountAmount() + this.deliveryFee()).toFixed(2));
  }

  applyCoupon() {
    const code = this.couponCode().trim();
    if (!code) {
      this.toast.error('Please enter a coupon code');
      return;
    }

    if (this.subtotal() <= 0) {
      this.toast.error('Your cart is empty');
      return;
    }

    this.couponLoading.set(true);
    this.couponService.applyCoupon(code, this.subtotal()).subscribe({
      next: (res) => {
        this.appliedCoupon.set(res);
        this.toast.success(`Coupon ${res.code} applied! Saved ₹${res.discountAmount}`);
        this.couponLoading.set(false);
      },
      error: (err) => {
        this.toast.error(err.error?.message || 'Invalid promo code');
        this.couponLoading.set(false);
      }
    });
  }

  removeCoupon() {
    this.appliedCoupon.set(null);
    this.couponCode.set('');
    this.toast.success('Coupon removed');
  }

  updateQty(itemId: string, qty: number) {
    if (qty <= 0) {
      this.cartService.removeFromCart(itemId);
    } else {
      this.cartService.updateQuantity(itemId, qty);
    }
  }

  handleCheckout() {
    const user = this.authService.user();
    if (!user) {
      this.toast.error('Please login to checkout');
      return;
    }

    const items = this.cartService.items().map(i => ({
      productId: i.productId,
      quantity: i.quantity,
      price: i.product.price
    }));

    this.checkoutLoading.set(true);

    this.orderService.checkoutWithRazorpay(
      user,
      items,
      this.total(),
      () => {
        this.cartService.clearCart();
        this.appliedCoupon.set(null);
        this.checkoutLoading.set(false);
      }
    );
  }
}
