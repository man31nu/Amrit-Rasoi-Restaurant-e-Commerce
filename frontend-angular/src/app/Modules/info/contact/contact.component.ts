import { Component, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastService } from '@services';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ContactComponent {
  private toast = inject(ToastService);

  name = '';
  email = '';
  subject = '';
  message = '';
  isSubmitting = signal<boolean>(false);

  contactInfos = [
    { type: 'location', title: 'Visit Us', details: 'Sabour, Bhagalpur, Bihar', color: 'text-orange-600', bg: 'bg-orange-50' },
    { type: 'phone', title: 'Call Us', details: '+91 9876 543 210', color: 'text-blue-600', bg: 'bg-blue-50' },
    { type: 'email', title: 'Email Us', details: 'info@amrit_rasoi.com', color: 'text-green-600', bg: 'bg-green-50' },
    { type: 'hours', title: 'Open Hours', details: 'Mon - Sun: 9AM - 11PM', color: 'text-purple-600', bg: 'bg-purple-50' },
  ];

  handleSubmit() {
    this.isSubmitting.set(true);
    setTimeout(() => {
      this.toast.success('Message sent! We will get back to you soon.');
      this.name = '';
      this.email = '';
      this.subject = '';
      this.message = '';
      this.isSubmitting.set(false);
    }, 1200);
  }
}
