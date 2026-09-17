import { Component, OnInit, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ProductService } from '@services';
import { ToastService } from '@services';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './product-form.component.html',
  styleUrl: './product-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductFormComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private productService = inject(ProductService);
  private toast = inject(ToastService);

  isEdit = signal<boolean>(false);
  productId = signal<string | null>(null);
  loading = signal<boolean>(false);

  name = '';
  category = '';
  price = '';
  description = '';
  isVeg = true;
  spiceLevel = 'Mild';
  imageFile: File | null = null;
  preview = signal<string>('');

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEdit.set(true);
      this.productId.set(id);
      this.productService.getProductById(id).subscribe({
        next: (p) => {
          this.name = p.name;
          this.category = p.category;
          this.price = p.price.toString();
          this.description = p.description;
          this.isVeg = p.isVeg !== undefined ? p.isVeg : true;
          this.spiceLevel = p.spiceLevel || 'Mild';
          this.preview.set(p.imageUrl);
        },
        error: () => {
          this.toast.error('Failed to load dish details');
          this.router.navigate(['/admin']);
        }
      });
    }
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.imageFile = input.files[0];
      this.preview.set(URL.createObjectURL(this.imageFile));
    }
  }

  handleSubmit() {
    this.loading.set(true);
    const formData = new FormData();
    formData.append('name', this.name);
    formData.append('category', this.category);
    formData.append('price', this.price);
    formData.append('description', this.description);
    formData.append('isVeg', String(this.isVeg));
    formData.append('spiceLevel', this.spiceLevel);
    if (this.imageFile) {
      formData.append('image', this.imageFile);
    }

    const id = this.productId();
    if (this.isEdit() && id) {
      this.productService.updateProduct(id, formData).subscribe({
        next: () => {
          this.toast.success('Product updated successfully');
          this.loading.set(false);
          this.router.navigate(['/admin']);
        },
        error: (err) => {
          this.toast.error(err.error?.message || 'Something went wrong');
          this.loading.set(false);
        }
      });
    } else {
      this.productService.createProduct(formData).subscribe({
        next: () => {
          this.toast.success('Product created successfully');
          this.loading.set(false);
          this.router.navigate(['/admin']);
        },
        error: (err) => {
          this.toast.error(err.error?.message || 'Something went wrong');
          this.loading.set(false);
        }
      });
    }
  }
}
