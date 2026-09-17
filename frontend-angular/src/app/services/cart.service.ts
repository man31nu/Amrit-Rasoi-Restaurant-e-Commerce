import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap, map } from 'rxjs';
import { CartItem } from '@models';
import { ToastService } from './toast.service';
import { AuthService } from './auth.service';
import { environment } from '@environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private http = inject(HttpClient);
  private toast = inject(ToastService);
  private auth = inject(AuthService);
  private apiUrl = `${environment.apiUrl}/cart`;

  items = signal<CartItem[]>([]);
  loading = signal<boolean>(false);

  totalCount = computed(() =>
    this.items().reduce((acc, item) => acc + item.quantity, 0)
  );

  totalAmount = computed(() =>
    this.items().reduce((acc, item) => acc + (item.product?.price || 0) * item.quantity, 0)
  );

  fetchCart() {
    if (!this.auth.isLoggedIn()) {
      this.items.set([]);
      return;
    }

    this.loading.set(true);
    this.http.get<any>(this.apiUrl).pipe(
      map(res => res.data || res)
    ).subscribe({
      next: (cartData) => {
        this.items.set(cartData?.items || []);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      },
    });
  }

  addToCart(productId: string, quantity = 1) {
    if (!this.auth.isLoggedIn()) {
      this.toast.error('Please login to add items to your cart');
      return;
    }

    this.http.post<any>(this.apiUrl, { productId, quantity }).pipe(
      map(res => res.data || res),
      tap({
        next: (cartData) => {
          this.items.set(cartData?.items || []);
          this.toast.success('Item added to cart!');
        },
        error: (err) => {
          this.toast.error(err.error?.message || 'Failed to add item');
        },
      })
    ).subscribe();
  }

  updateQuantity(itemId: string, quantity: number) {
    this.http.put<any>(`${this.apiUrl}/${itemId}`, { quantity }).pipe(
      map(res => res.data || res),
      tap({
        next: (cartData) => {
          this.items.set(cartData?.items || []);
        },
        error: (err) => {
          this.toast.error(err.error?.message || 'Failed to update quantity');
        },
      })
    ).subscribe();
  }

  removeFromCart(itemId: string) {
    this.http.delete<any>(`${this.apiUrl}/${itemId}`).pipe(
      map(res => res.data || res),
      tap({
        next: (cartData) => {
          this.items.set(cartData?.items || []);
          this.toast.info('Item removed from cart');
        },
        error: (err) => {
          this.toast.error(err.error?.message || 'Failed to remove item');
        },
      })
    ).subscribe();
  }

  clearCart() {
    this.items.set([]);
  }
}
