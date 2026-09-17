import { Component, EventEmitter, Input, Output, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface CategoryItem {
  id: string;
  name: string;
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
    { id: 'All', name: 'All Menu' },
    { id: 'Veg Main Course', name: 'Veg Main' },
    { id: 'Non-Veg Main Course', name: 'Non-Veg' },
    { id: 'Pizza', name: 'Pizza' },
    { id: 'Burgers', name: 'Burgers' },
    { id: 'Desserts', name: 'Desserts' },
    { id: 'Drinks', name: 'Drinks' },
  ];

  selectCategory(id: string) {
    this.selectedCategory = id;
    this.categoryChange.emit(id);
  }
}
