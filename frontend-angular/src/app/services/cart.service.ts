import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs';
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
    this.http.get<{ items: CartItem[] }>(this.apiUrl).subscribe({
      next: (data) => {
        this.items.set(data.items || []);
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

    this.http.post<{ items: CartItem[] }>(this.apiUrl, { productId, quantity }).pipe(
      tap({
        next: (res) => {
          this.items.set(res.items || []);
          this.toast.success('Item added to cart!');
        },
        error: (err) => {
          this.toast.error(err.error?.message || 'Failed to add item');
        },
      })
    ).subscribe();
  }

  updateQuantity(itemId: string, quantity: number) {
    this.http.put<{ items: CartItem[] }>(`${this.apiUrl}/${itemId}`, { quantity }).pipe(
      tap({
        next: (res) => {
          this.items.set(res.items || []);
        },
        error: (err) => {
          this.toast.error(err.error?.message || 'Failed to update quantity');
        },
      })
    ).subscribe();
  }

  removeFromCart(itemId: string) {
    this.http.delete<{ items: CartItem[] }>(`${this.apiUrl}/${itemId}`).pipe(
      tap({
        next: (res) => {
          this.items.set(res.items || []);
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
