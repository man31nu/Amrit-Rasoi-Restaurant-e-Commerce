import { Component, OnInit, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CartService } from '@services';

@Component({
  selector: 'app-success',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './success.component.html',
  styleUrl: './success.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SuccessComponent implements OnInit {
  private cartService = inject(CartService);

  ngOnInit() {
    this.cartService.clearCart();
  }
}
