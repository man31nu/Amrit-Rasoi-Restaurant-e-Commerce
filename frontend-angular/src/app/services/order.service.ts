import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Order, AnalyticsData } from '@models';
import { ToastService } from './toast.service';
import { Router } from '@angular/router';
import { environment } from '@environments/environment';

declare global {
  interface Window {
    Razorpay: any;
  }
}

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private http = inject(HttpClient);
  private toast = inject(ToastService);
  private router = inject(Router);
  private apiUrl = `${environment.apiUrl}/orders`;

  getMyOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.apiUrl}/myorders`);
  }

  getAllOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.apiUrl}/all`);
  }

  updateOrderStatus(orderId: string, status: string): Observable<Order> {
    return this.http.put<Order>(`${this.apiUrl}/${orderId}/status`, { status });
  }

  getAnalytics(): Observable<AnalyticsData> {
    return this.http.get<AnalyticsData>(`${this.apiUrl}/analytics`);
  }

  createOrder(items: { productId: string; quantity: number; price: number }[], totalAmount: number): Observable<{
    success: boolean;
    orderId: string;
    amount: number;
    currency: string;
    dbOrderId: string;
  }> {
    return this.http.post<any>(`${this.apiUrl}/create`, { items, totalAmount });
  }

  verifyPayment(data: {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
    dbOrderId: string;
  }): Observable<{ success: boolean; message: string; order: Order }> {
    return this.http.post<any>(`${this.apiUrl}/verify`, data);
  }

  checkoutWithRazorpay(
    user: { name: string; email: string; phone?: string },
    items: { productId: string; quantity: number; price: number }[],
    totalAmount: number,
    onSuccess?: (order: Order) => void
  ) {
    if (!window.Razorpay) {
      this.toast.error('Razorpay SDK failed to load. Please refresh the page.');
      return;
    }

    this.createOrder(items, totalAmount).subscribe({
      next: (res) => {
        const options = {
          key: environment.razorpayKey,
          amount: res.amount,
          currency: res.currency || 'INR',
          name: environment.appName,
          description: 'Payment for your delicious meal',
          image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?q=80&w=300',
          order_id: res.orderId,
          handler: (response: any) => {
            this.verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              dbOrderId: res.dbOrderId,
            }).subscribe({
              next: (verifyRes) => {
                this.toast.success('Payment successful! Order confirmed.');
                if (onSuccess) onSuccess(verifyRes.order);
                this.router.navigate(['/success'], { state: { order: verifyRes.order } });
              },
              error: (err) => {
                this.toast.error(err.error?.message || 'Payment verification failed');
              },
            });
          },
          prefill: {
            name: user.name,
            email: user.email,
            contact: user.phone || '9999999999',
          },
          theme: {
            color: '#ea580c',
          },
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
      },
      error: (err) => {
        this.toast.error(err.error?.message || 'Could not initiate payment');
      },
    });
  }
}
