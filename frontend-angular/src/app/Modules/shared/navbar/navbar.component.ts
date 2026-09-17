import { Component, HostListener, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs';
import { AuthService } from '@services';
import { CartService } from '@services';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NavbarComponent {
  authService = inject(AuthService);
  cartService = inject(CartService);
  private router = inject(Router);

  currentUrl = signal<string>('/');
  scrollY = signal<number>(0);
  isMobileMenuOpen = signal<boolean>(false);
  isProfileOpen = signal<boolean>(false);

  constructor() {
    this.router.events.pipe(filter(e => e instanceof NavigationEnd)).subscribe((e: any) => {
      this.currentUrl.set(e.urlAfterRedirects || e.url);
      this.closeMenus();
    });
  }

  @HostListener('window:scroll')
  onScroll() {
    this.scrollY.set(window.scrollY);
  }

  isScrolled(): boolean {
    const isDarkHeader = this.currentUrl() === '/' || this.currentUrl() === '/about';
    return this.scrollY() > 20 || !isDarkHeader;
  }

  toggleMobileMenu() {
    this.isMobileMenuOpen.update(v => !v);
  }

  toggleProfile() {
    this.isProfileOpen.update(v => !v);
  }

  closeMenus() {
    this.isMobileMenuOpen.set(false);
    this.isProfileOpen.set(false);
  }

  handleLogout() {
    this.closeMenus();
    this.authService.logout();
  }
}
