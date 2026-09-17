import { Injectable, signal, effect } from '@angular/core';

export type ThemeMode = 'light' | 'dark';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  isDarkMode = signal<boolean>(false);

  constructor() {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme');
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      const initialDark = savedTheme === 'dark' || (!savedTheme && prefersDark);
      
      this.isDarkMode.set(initialDark);
      this.applyTheme(initialDark);
    }
  }

  toggleTheme(): void {
    const nextState = !this.isDarkMode();
    this.isDarkMode.set(nextState);
    this.applyTheme(nextState);
    if (typeof window !== 'undefined') {
      localStorage.setItem('theme', nextState ? 'dark' : 'light');
    }
  }

  private applyTheme(isDark: boolean): void {
    if (typeof document !== 'undefined') {
      const root = document.documentElement;
      if (isDark) {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    }
  }
}
