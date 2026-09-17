import { Component, inject, signal, ChangeDetectionStrategy, OnInit, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, Router, ActivatedRoute } from '@angular/router';
import { AuthService, ToastService, GoogleAuthService } from '@services';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginComponent implements OnInit, AfterViewInit {
  private auth = inject(AuthService);
  private toast = inject(ToastService);
  private googleAuth = inject(GoogleAuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  @ViewChild('googleBtnContainer') googleBtnContainer!: ElementRef<HTMLDivElement>;

  email = '';
  password = '';
  showPw = signal<boolean>(false);
  loading = signal<boolean>(false);

  ngOnInit() {
    this.googleAuth.setCallback((response) => this.onGoogleResponse(response));
  }

  ngAfterViewInit() {
    if (this.googleBtnContainer?.nativeElement) {
      this.googleAuth.renderButton(this.googleBtnContainer.nativeElement);
    }
  }

  private onGoogleResponse(response: any) {
    if (!response?.credential) return;

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
      error: () => this.loading.set(false),
    });
  }

  async handleGoogleLogin() {
    try {
      await this.googleAuth.prompt();
    } catch (err: any) {
      this.toast.error(err?.message || 'Google Sign-In failed. Please try again.');
    }
  }
}
