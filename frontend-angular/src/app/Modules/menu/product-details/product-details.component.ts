import { Component, OnInit, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Product } from '@models';
import { ProductService, CartService, AuthService, ReviewService, ToastService } from '@services';

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductDetailsComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private productService = inject(ProductService);
  private cartService = inject(CartService);
  authService = inject(AuthService);
  private reviewService = inject(ReviewService);
  private toast = inject(ToastService);

  product = signal<Product | null>(null);
  loading = signal<boolean>(true);
  quantity = signal<number>(1);

  newRating = signal<number>(5);
  newComment = signal<string>('');
  submittingReview = signal<boolean>(false);

  ngOnInit() {
    this.loadProductDetails();
  }

  loadProductDetails() {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.router.navigate(['/']);
      return;
    }

    this.productService.getProductById(id).subscribe({
      next: (data) => {
        this.product.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.toast.error('Product not found');
        this.router.navigate(['/']);
      },
    });
  }

  increment() {
    this.quantity.update(q => q + 1);
  }

  decrement() {
    this.quantity.update(q => Math.max(1, q - 1));
  }

  addToCart() {
    const prod = this.product();
    if (prod) {
      this.cartService.addToCart(prod.id, this.quantity());
    }
  }

  setRating(rating: number) {
    this.newRating.set(rating);
  }

  submitReview() {
    const prod = this.product();
    if (!prod) return;

    if (!this.authService.user()) {
      this.toast.error('Please login to leave a review');
      return;
    }

    if (!this.newComment().trim()) {
      this.toast.error('Please write a brief comment');
      return;
    }

    this.submittingReview.set(true);
    this.reviewService.addReview(prod.id, {
      rating: this.newRating(),
      comment: this.newComment()
    }).subscribe({
      next: () => {
        this.toast.success('Thank you for your review!');
        this.newComment.set('');
        this.newRating.set(5);
        this.submittingReview.set(false);
        this.loadProductDetails();
      },
      error: (err) => {
        this.toast.error(err.error?.message || 'Failed to submit review');
        this.submittingReview.set(false);
      }
    });
  }
}
