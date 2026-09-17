import { Component, OnInit, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { User } from '@models';
import { AuthService } from '@services';
import { ToastService } from '@services';

@Component({
  selector: 'app-admin-users',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-users.component.html',
  styleUrl: './admin-users.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdminUsersComponent implements OnInit {
  private authService = inject(AuthService);
  private toast = inject(ToastService);

  users = signal<User[]>([]);
  loading = signal<boolean>(true);

  ngOnInit() {
    this.fetchUsers();
  }

  fetchUsers() {
    this.authService.getUsers().subscribe({
      next: (data) => {
        this.users.set(data || []);
        this.loading.set(false);
      },
      error: () => {
        this.toast.error('Failed to fetch users');
        this.loading.set(false);
      },
    });
  }

  toggleRole(user: User) {
    const newRole = user.role === 'admin' ? 'user' : 'admin';
    this.authService.updateUserRole(user.id, newRole).subscribe({
      next: () => {
        this.toast.success(`User role updated to ${newRole}`);
        this.fetchUsers();
      },
      error: () => {
        this.toast.error('Failed to update role');
      },
    });
  }

  formatDate(dateStr?: string): string {
    if (!dateStr) return 'N/A';
    try {
      return new Date(dateStr).toLocaleDateString();
    } catch {
      return dateStr;
    }
  }
}
