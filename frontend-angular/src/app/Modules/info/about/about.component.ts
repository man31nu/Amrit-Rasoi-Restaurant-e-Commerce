import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './about.component.html',
  styleUrl: './about.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AboutComponent {
  stats = [
    { label: 'Year of Excellence', value: '1+', type: 'excellence' },
    { label: 'Master Chefs', value: '3', type: 'chefs' },
    { label: 'Happy Customers', value: '1k+', type: 'customers' },
    { label: 'Expert Staff', value: '10+', type: 'staff' },
  ];

  chefs = [
    { name: 'Vikram Malhotra', role: 'Executive Chef', img: '/images/vikram.png' },
    { name: 'Ananya Iyer', role: 'Head of Spices', img: '/images/ananya.png' },
    { name: 'Arjun Kapoor', role: 'Master of Tandoor', img: '/images/arjun.png' },
  ];
}
