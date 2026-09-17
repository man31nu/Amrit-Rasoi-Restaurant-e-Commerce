import { Component, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, Router, ActivatedRoute } from '@angular/router';
import { AuthService, ToastService } from '@services';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginComponent {
  private auth = inject(AuthService);
  private toast = inject(ToastService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  email = '';
  password = '';
  showPw = signal<boolean>(false);
  loading = signal<boolean>(false);

  togglePw() {
    this.showPw.update(v => !v);
  }

  handleSubmit() {
    if (!this.email || !this.password) return;

    this.loading.set(true);
    this.auth.login({ email: this.email, password: this.password }).subscribe({
      next: () => {
        this.loading.set(false);
        const redirect = this.route.snapshot.queryParams['redirect'] || '/';
        this.router.navigateByUrl(redirect);
      },
      error: () => {
        this.loading.set(false);
      },
    });
  }

  handleGoogleLogin() {
    // Trigger real Google OAuth login via Google Identity Services
    if (typeof window !== 'undefined' && (window as any).google?.accounts?.id) {
      (window as any).google.accounts.id.prompt((notification: any) => {
        if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
          this.toast.error('Google Sign-In prompt unavailable. Please enter credentials directly.');
        }
      });
    } else {
      this.toast.error('Google OAuth client is not initialized. Please set GOOGLE_CLIENT_ID.');
    }
  }
}
