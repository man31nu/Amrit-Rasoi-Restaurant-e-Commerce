import { Component, OnInit, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs';
import { NavbarComponent } from './Modules/shared/navbar/navbar.component';
import { FooterComponent } from './Modules/shared/footer/footer.component';
import { ToastComponent } from './Modules/shared/toast/toast.component';
import { CartService } from './services/cart.service';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, NavbarComponent, FooterComponent, ToastComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements OnInit {
  cartService = inject(CartService);
  authService = inject(AuthService);
  private router = inject(Router);

  currentUrl = signal<string>('/');

  constructor() {
    this.router.events.pipe(filter(e => e instanceof NavigationEnd)).subscribe((e: any) => {
      this.currentUrl.set(e.urlAfterRedirects || e.url);
      window.scrollTo({ top: 0, behavior: 'instant' });
    });
  }

  ngOnInit() {
    if (this.authService.isLoggedIn()) {
      this.cartService.fetchCart();
    }
  }

  showFloatingCart(): boolean {
    return this.cartService.totalCount() > 0 && this.currentUrl() !== '/cart';
  }
}
