import { Component, OnInit, inject, signal, computed, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Product } from '@models';
import { ProductService } from '@services';
import { ToastService } from '@services';

@Component({
  selector: 'app-admin-products',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './admin-products.component.html',
  styleUrl: './admin-products.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdminProductsComponent implements OnInit {
  private productService = inject(ProductService);
  private toast = inject(ToastService);

  products = signal<Product[]>([]);
  loading = signal<boolean>(true);
  searchTerm = signal<string>('');

  filteredProducts = computed(() => {
    const term = this.searchTerm().toLowerCase();
    return this.products().filter(p =>
      p.name.toLowerCase().includes(term) ||
      p.category.toLowerCase().includes(term)
    );
  });

  ngOnInit() {
    this.fetchProducts();
  }

  fetchProducts() {
    this.productService.getProducts().subscribe({
      next: (data) => {
        this.products.set(data || []);
        this.loading.set(false);
      },
      error: () => {
        this.toast.error('Failed to fetch products');
        this.loading.set(false);
      }
    });
  }

  deleteHandler(id: string) {
    if (confirm('Are you sure you want to retire this creation from the menu?')) {
      this.productService.deleteProduct(id).subscribe({
        next: () => {
          this.toast.success('Creation retired successfully');
          this.fetchProducts();
        },
        error: (err) => {
          this.toast.error(err.error?.message || 'Retirement failed');
        }
      });
    }
  }
}
