import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { User } from '@models';
import { ToastService } from './toast.service';
import { environment } from '@environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private toast = inject(ToastService);
  private apiUrl = `${environment.apiUrl}/auth`;

  private readonly STORAGE_KEY = 'rxUser';

  private storedUser(): User | null {
    try {
      const data = localStorage.getItem(this.STORAGE_KEY);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  }

  user = signal<User | null>(this.storedUser());
  token = computed(() => this.user()?.token ?? null);
  isLoggedIn = computed(() => !!this.user());
  isAdmin = computed(() => this.user()?.role === 'admin');

  signup(data: { name: string; email: string; password: string }): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/signup`, data).pipe(
      tap({
        next: (user) => {
          this.setUser(user);
          this.toast.success(`Welcome to Amrit Rasoi, ${user.name}!`);
        },
        error: (err) => {
          this.toast.error(err.error?.message || 'Signup failed');
        },
      })
    );
  }

  login(data: { email: string; password: string }): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/login`, data).pipe(
      tap({
        next: (user) => {
          this.setUser(user);
          this.toast.success(`Welcome back, ${user.name}!`);
        },
        error: (err) => {
          this.toast.error(err.error?.message || 'Invalid email or password');
        },
      })
    );
  }

  logout() {
    this.user.set(null);
    localStorage.removeItem(this.STORAGE_KEY);
    this.toast.success('Logged out successfully');
    this.router.navigate(['/login']);
  }

  getProfile(): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/profile`);
  }

  updateProfile(data: Partial<User>): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/profile`, data).pipe(
      tap({
        next: (updatedUser) => {
          const current = this.user();
          if (current) {
            this.setUser({ ...current, ...updatedUser });
          }
          this.toast.success('Profile updated successfully');
        },
        error: (err) => {
          this.toast.error(err.error?.message || 'Failed to update profile');
        },
      })
    );
  }

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/users`);
  }

  updateUserRole(userId: string, role: 'user' | 'admin'): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/users/${userId}/role`, { role });
  }

  setUser(user: User) {
    this.user.set(user);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(user));
  }
}
