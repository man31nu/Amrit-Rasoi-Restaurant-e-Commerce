import { Component, inject, signal, ChangeDetectionStrategy, OnInit, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { AuthService, ToastService, GoogleAuthService } from '@services';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SignupComponent implements OnInit, AfterViewInit {
  private auth = inject(AuthService);
  private toast = inject(ToastService);
  private googleAuth = inject(GoogleAuthService);
  private router = inject(Router);

  @ViewChild('googleBtnContainer') googleBtnContainer!: ElementRef<HTMLDivElement>;

  name = '';
  email = '';
  password = '';
  confirm = '';
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
        this.router.navigate(['/']);
      },
      error: () => this.loading.set(false)
    });
  }

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
