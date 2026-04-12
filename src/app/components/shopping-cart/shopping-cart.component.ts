import { Component, inject, signal } from '@angular/core';
import { CartItem, CartItemService } from '../../services/cart-item.service';
import { DecimalPipe } from '@angular/common';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
@Component({
  selector: 'app-shopping-cart',
  imports: [CommonModule],
  templateUrl: './shopping-cart.component.html',
  styleUrl: './shopping-cart.component.scss',
})
export class ShoppingCartComponent {
  cartService = inject(CartItemService);
  router = inject(Router) ;


marketOpen = signal<boolean | null>(null);
  cart = signal<CartItem[]> ([]);

 
  ngOnInit() {
this.cartService.loadProductTypes();
this.cartService.loadCart()
    this.cart = this.cartService.cart
     this.cartService.loadMarketStatus().subscribe({
    next: (res) => {
      this.marketOpen.set(res.value === 'true');
    },
    error: (err) => {
      console.error('MARKET STATUS ERROR 👉', err);
    }
  });
}
increase(item: CartItem) {
  this.cartService.addToCart(item.product.id, 1).subscribe({
    next: (res) => {
      console.log('UPDATED ITEM 👉', res);
    },
    error: (err) => {
      console.error('ERROR 👉', err);
    }
  });
}

decrease(item: CartItem) {
  this.cartService.decrement(item.product.id, 1).subscribe(() => {
    this.cartService.loadCart();
  });
}
remove(item: CartItem) {
  this.cartService.remove(item.id) .subscribe(()=>{
    this.cartService.loadCart()
  } );
}
getSubtotal(): number {
  return this.cart().reduce((sum, item) => sum + (item.totalPrice || 0), 0);
}

continueShopping() {
  this.router.navigate(['/dashboard/products']);
}

checkout() {
  this.router.navigate(['/check-out']);
}
}
