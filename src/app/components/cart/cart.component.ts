import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CartItemService } from '../../services/cart-item.service';
@Component({
  selector: 'app-cart',
  imports: [],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss',
})
export class CartComponent {
  private router = inject (Router);
  cartService = inject(CartItemService);

goToCart() {
  this.router.navigate(['/shopping-cart']);
}


}
