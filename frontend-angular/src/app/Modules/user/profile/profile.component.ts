import { Component, OnInit, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '@services';
import { ToastService } from '@services';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProfileComponent implements OnInit {
  authService = inject(AuthService);
  private toast = inject(ToastService);

  name = '';
  phone = '';
  address = '';
  password = '';
  confirmPassword = '';
  loading = signal<boolean>(false);

  ngOnInit() {
    this.authService.getProfile().subscribe({
      next: (user) => {
        this.name = user.name || '';
        this.phone = user.phone || '';
        this.address = user.address || '';
      },
      error: () => {
        const u = this.authService.user();
        if (u) {
          this.name = u.name || '';
          this.phone = u.phone || '';
          this.address = u.address || '';
        }
      }
    });
  }

  handleSubmit() {
    if (this.password && this.password !== this.confirmPassword) {
      this.toast.error('Passwords do not match');
      return;
    }

    this.loading.set(true);
    const payload: any = {
      name: this.name,
      phone: this.phone,
      address: this.address,
    };
    if (this.password) payload.password = this.password;

    this.authService.updateProfile(payload).subscribe({
      next: () => {
        this.loading.set(false);
        this.password = '';
        this.confirmPassword = '';
      },
      error: () => {
        this.loading.set(false);
      }
    });
  }
}
