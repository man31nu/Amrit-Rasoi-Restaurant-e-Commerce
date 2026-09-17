import { Component, inject, signal, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, Router, ActivatedRoute } from '@angular/router';
import { AuthService, ToastService } from '@services';
import { environment } from '@environments/environment';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginComponent implements OnInit {
  private auth = inject(AuthService);
  private toast = inject(ToastService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  email = '';
  password = '';
  showPw = signal<boolean>(false);
  loading = signal<boolean>(false);

  ngOnInit() {
    if (typeof window !== 'undefined' && environment.googleClientId && (window as any).google?.accounts?.id) {
      try {
        (window as any).google.accounts.id.initialize({
          client_id: environment.googleClientId,
          callback: (response: any) => this.onGoogleResponse(response)
        });
      } catch (err) {
        console.error('Google Auth Init error:', err);
      }
    }
  }

  private onGoogleResponse(response: any) {
    if (response?.credential) {
      this.loading.set(true);
      this.auth.loginWithGoogle(response.credential).subscribe({
        next: () => {
          this.loading.set(false);
          const redirect = this.route.snapshot.queryParams['redirect'] || '/';
          this.router.navigateByUrl(redirect);
        },
        error: () => this.loading.set(false)
      });
    }
  }

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
    if (typeof window !== 'undefined' && (window as any).google?.accounts?.id) {
      if (!environment.googleClientId) {
        this.toast.error('Google Sign-In client ID is not configured.');
        return;
      }
      try {
        (window as any).google.accounts.id.prompt((notification: any) => {
          if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
            console.log('Google prompt status:', notification.getNotDisplayedReason?.() || notification.getSkippedReason?.());
          }
        });
      } catch (err) {
        console.error('Google prompt error:', err);
      }
    } else {
      this.toast.error('Google Identity SDK loading. Please try again in a moment.');
    }
  }
}
