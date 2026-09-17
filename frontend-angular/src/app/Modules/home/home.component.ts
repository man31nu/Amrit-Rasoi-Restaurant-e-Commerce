import { Component, OnInit, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Product } from '@models';
import { ProductService, ToastService } from '@services';
import { CategoryFilterComponent } from '@modules/menu/category-filter/category-filter.component';
import { ProductCardComponent } from '@modules/menu/product-card/product-card.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [FormsModule, CategoryFilterComponent, ProductCardComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent implements OnInit {
  private productService = inject(ProductService);
  private toast = inject(ToastService);

  products = signal<Product[]>([]);
  loading = signal<boolean>(true);
  selectedCategory = signal<string>('All');
  searchQuery = signal<string>('');
  sortOption = signal<string>('newest');
  selectedVegFilter = signal<string>('all');
  selectedSpiceFilter = signal<string>('all');

  ngOnInit() {
    this.fetchProducts();
  }

  fetchProducts() {
    this.loading.set(true);
    const sort = this.sortOption();
    const sortBy = sort.startsWith('price') ? 'price' : sort;
    const order = sort === 'price-asc' ? 'asc' : sort === 'price-desc' ? 'desc' : undefined;

    this.productService.getProducts({
      category: this.selectedCategory(),
      search: this.searchQuery(),
      sortBy,
      order,
      isVeg: this.selectedVegFilter(),
      spiceLevel: this.selectedSpiceFilter(),
    }).subscribe({
      next: (data) => {
        this.products.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.toast.error('Failed to load menu');
        this.loading.set(false);
      },
    });
  }

  onCategoryChange(cat: string) {
    this.selectedCategory.set(cat);
    this.fetchProducts();
  }

  onSearchChange(query: string) {
    this.searchQuery.set(query);
    this.fetchProducts();
  }

  onSortChange(sort: string) {
    this.sortOption.set(sort);
    this.fetchProducts();
  }

  onVegFilterChange(val: string) {
    this.selectedVegFilter.set(val);
    this.fetchProducts();
  }

  onSpiceFilterChange(val: string) {
    this.selectedSpiceFilter.set(val);
    this.fetchProducts();
  }

  scrollToMenu() {
    const el = document.getElementById('menu-section');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  }
}
