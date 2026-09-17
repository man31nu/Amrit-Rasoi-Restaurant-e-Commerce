import { Component, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '@services';
import { AdminAnalyticsComponent } from '@modules/admin/admin-analytics/admin-analytics.component';
import { AdminProductsComponent } from '@modules/admin/admin-products/admin-products.component';
import { AdminOrdersComponent } from '@modules/admin/admin-orders/admin-orders.component';
import { AdminUsersComponent } from '@modules/admin/admin-users/admin-users.component';

type AdminTab = 'stats' | 'products' | 'orders' | 'users';

interface MenuItem {
  id: AdminTab;
  label: string;
  emoji: string;
}

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    AdminAnalyticsComponent,
    AdminProductsComponent,
    AdminOrdersComponent,
    AdminUsersComponent,
  ],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdminDashboardComponent {
  authService = inject(AuthService);

  activeTab = signal<AdminTab>('stats');

  menuItems: MenuItem[] = [
    { id: 'stats', label: 'Overview', emoji: '📊' },
    { id: 'products', label: 'Inventory', emoji: '📦' },
    { id: 'orders', label: 'Live Orders', emoji: '🛍️' },
    { id: 'users', label: 'User Roles', emoji: '👥' },
  ];

  getActiveTitle(): string {
    const item = this.menuItems.find(m => m.id === this.activeTab());
    return item?.label || 'Dashboard';
  }
}
