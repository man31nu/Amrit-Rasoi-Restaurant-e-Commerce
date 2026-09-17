import { Component, OnInit, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Order } from '@models';
import { OrderService } from '@services';
import { ToastService } from '@services';

interface Step {
  id: string;
  label: string;
  stepNum: string;
}

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OrdersComponent implements OnInit {
  private orderService = inject(OrderService);
  private toast = inject(ToastService);

  orders = signal<Order[]>([]);
  loading = signal<boolean>(true);

  steps: Step[] = [
    { id: 'paid', label: 'Confirmed', stepNum: '1' },
    { id: 'preparing', label: 'Kitchen', stepNum: '2' },
    { id: 'out-for-delivery', label: 'Shipping', stepNum: '3' },
    { id: 'delivered', label: 'Arrived', stepNum: '4' },
  ];

  ngOnInit() {
    this.orderService.getMyOrders().subscribe({
      next: (data) => {
        this.orders.set(data || []);
        this.loading.set(false);
      },
      error: () => {
        this.toast.error('Failed to load orders');
        this.loading.set(false);
      },
    });
  }

  getStepIndex(status: string): number {
    const idx = this.steps.findIndex(s => s.id === status);
    if (idx !== -1) return idx;
    return status === 'pending' ? -1 : 0;
  }

  getStepProgress(status: string): number {
    const idx = this.getStepIndex(status);
    if (idx < 0) return 0;
    return (idx / (this.steps.length - 1)) * 100;
  }

  formatDate(dateStr: string): string {
    try {
      return new Date(dateStr).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      });
    } catch {
      return dateStr;
    }
  }
}
