import { Component, OnInit, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderService } from '@services';
import { AnalyticsData } from '@models';
import { ToastService } from '@services';

@Component({
  selector: 'app-admin-analytics',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-analytics.component.html',
  styleUrl: './admin-analytics.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdminAnalyticsComponent implements OnInit {
  private orderService = inject(OrderService);
  private toast = inject(ToastService);

  data = signal<AnalyticsData | null>(null);
  loading = signal<boolean>(true);
  chartDates: string[] = [];
  maxSale = 100;

  ngOnInit() {
    this.orderService.getAnalytics().subscribe({
      next: (res) => {
        this.data.set(res);
        if (res?.salesByDate) {
          this.chartDates = Object.keys(res.salesByDate).sort();
          const values = Object.values(res.salesByDate);
          this.maxSale = Math.max(...values, 100);
        }
        this.loading.set(false);
      },
      error: () => {
        this.toast.error('Failed to load analytics');
        this.loading.set(false);
      },
    });
  }

  getBarHeight(value: number): number {
    return Math.max(5, (value / this.maxSale) * 100);
  }

  formatWeekday(dateStr: string): string {
    try {
      return new Date(dateStr).toLocaleDateString('en-US', { weekday: 'short' });
    } catch {
      return dateStr;
    }
  }
}
