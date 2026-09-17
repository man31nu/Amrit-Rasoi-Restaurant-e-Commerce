import { Component, EventEmitter, Input, Output, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface CategoryItem {
  id: string;
  name: string;
  emoji: string;
}

@Component({
  selector: 'app-category-filter',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './category-filter.component.html',
  styleUrl: './category-filter.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CategoryFilterComponent {
  @Input() selectedCategory = 'All';
  @Output() categoryChange = new EventEmitter<string>();

  categories: CategoryItem[] = [
    { id: 'All', name: 'All Menu', emoji: '🍽️' },
    { id: 'Veg Main Course', name: 'Veg Main', emoji: '🌱' },
    { id: 'Non-Veg Main Course', name: 'Non-Veg', emoji: '🍗' },
    { id: 'Pizza', name: 'Pizza', emoji: '🍕' },
    { id: 'Burgers', name: 'Burgers', emoji: '🍔' },
    { id: 'Desserts', name: 'Desserts', emoji: '🍨' },
    { id: 'Drinks', name: 'Drinks', emoji: '🍹' },
  ];

  selectCategory(id: string) {
    this.selectedCategory = id;
    this.categoryChange.emit(id);
  }
}
