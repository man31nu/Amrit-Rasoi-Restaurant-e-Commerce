import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap, map } from 'rxjs';
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
    return this.http.post<any>(`${this.apiUrl}/signup`, data).pipe(
      map((res) => res.data || res),
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
    return this.http.post<any>(`${this.apiUrl}/login`, data).pipe(
      map((res) => res.data || res),
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

  loginWithGoogle(credential: string): Observable<User> {
    return this.http.post<any>(`${this.apiUrl}/google`, { credential }).pipe(
      map((res) => res.data || res),
      tap({
        next: (user) => {
          this.setUser(user);
          this.toast.success(`Welcome to Amrit Rasoi, ${user.name}!`);
        },
        error: (err) => {
          this.toast.error(err.error?.message || 'Google Sign-In failed');
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
    return this.http.get<any>(`${this.apiUrl}/profile`).pipe(
      map((res) => res.data || res)
    );
  }

  updateProfile(data: Partial<User>): Observable<User> {
    return this.http.put<any>(`${this.apiUrl}/profile`, data).pipe(
      map((res) => res.data || res),
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
    return this.http.get<any>(`${this.apiUrl}/users`).pipe(
      map((res) => res.data || res)
    );
  }

  updateUserRole(userId: string, role: 'customer' | 'admin' | 'user'): Observable<User> {
    return this.http.put<any>(`${this.apiUrl}/users/${userId}/role`, { role }).pipe(
      map((res) => res.data || res)
    );
  }

  setUser(user: User) {
    this.user.set(user);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(user));
  }
}
