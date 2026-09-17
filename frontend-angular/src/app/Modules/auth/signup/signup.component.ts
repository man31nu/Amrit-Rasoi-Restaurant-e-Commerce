import { Component, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { AuthService } from '@services';
import { ToastService } from '@services';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SignupComponent {
  private auth = inject(AuthService);
  private toast = inject(ToastService);
  private router = inject(Router);

  name = '';
  email = '';
  password = '';
  confirm = '';
  showPw = signal<boolean>(false);
  loading = signal<boolean>(false);

  togglePw() {
    this.showPw.update(v => !v);
  }

  handleSubmit() {
    if (this.password !== this.confirm) {
      this.toast.error('Passwords do not match');
      return;
    }
    if (this.password.length < 6) {
      this.toast.error('Password must be at least 6 characters');
      return;
    }

    this.loading.set(true);
    this.auth.signup({ name: this.name, email: this.email, password: this.password }).subscribe({
      next: () => {
        this.loading.set(false);
        this.router.navigate(['/']);
      },
      error: () => {
        this.loading.set(false);
      },
    });
  }
}
