import { Component, OnInit, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Order } from '@models';
import { OrderService } from '@services';
import { ToastService } from '@services';

@Component({
  selector: 'app-admin-orders',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-orders.component.html',
  styleUrl: './admin-orders.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdminOrdersComponent implements OnInit {
  private orderService = inject(OrderService);
  private toast = inject(ToastService);

  orders = signal<Order[]>([]);
  loading = signal<boolean>(true);

  ngOnInit() {
    this.fetchOrders();
  }

  fetchOrders() {
    this.orderService.getAllOrders().subscribe({
      next: (data) => {
        this.orders.set(data || []);
        this.loading.set(false);
      },
      error: () => {
        this.toast.error('Failed to fetch orders');
        this.loading.set(false);
      },
    });
  }

  updateStatus(orderId: string, newStatus: string) {
    this.orderService.updateOrderStatus(orderId, newStatus).subscribe({
      next: () => {
        this.toast.success(`Order status updated to ${newStatus}`);
        this.fetchOrders();
      },
      error: () => {
        this.toast.error('Failed to update status');
      },
    });
  }

  getStatusBadgeClass(status: string): string {
    switch (status) {
      case 'pending': return 'bg-orange-100 text-orange-700';
      case 'paid': return 'bg-blue-100 text-blue-700';
      case 'preparing': return 'bg-purple-100 text-purple-700';
      case 'out-for-delivery': return 'bg-indigo-100 text-indigo-700';
      case 'delivered': return 'bg-green-100 text-green-700';
      case 'cancelled': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  }
}
