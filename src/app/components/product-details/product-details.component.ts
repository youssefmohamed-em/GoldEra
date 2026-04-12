import { Component, inject, signal, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ProductCategoryService, ProductDetails } from '../../services/product-category.service';
import { CartItem, CartItemService } from '../../services/cart-item.service';
import { ToastrService } from 'ngx-toastr';
import { DecimalPipe,    } from '@angular/common';

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [DecimalPipe,RouterModule ],
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.scss',
})
export class ProductDetailsComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private productService = inject(ProductCategoryService);
  private cartService = inject(CartItemService);
  private toastr = inject(ToastrService);

  productDetails = signal<ProductDetails | null>(null);
  loading = signal(true);
  quantity = signal(1);
  cart = signal<CartItem[]> ([]);
  marketOpen = signal<boolean | null>(null);

  ngOnInit(): void {
    this.cartService.loadCart()
    this.route.paramMap.subscribe((params) => {
      const slug = params.get('slug');
      if (slug) {
        this.fetchProductDetails(slug);
      } else {
        this.toastr.error('Product not found');
        this.router.navigate(['/dashboard/products']);
        this.cartService.loadMarketStatus();
      }
    });
  }

  fetchProductDetails(slug: string) {
    this.loading.set(true);
    this.productService.getProductBySlug(slug).subscribe({
      next: (product: ProductDetails) => {
        this.productDetails.set(product);
        this.cartService.loadCart()
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error fetching product details:', err);
        this.toastr.error('Failed to load product details');
        this.loading.set(false);
        this.router.navigate(['/dashboard/products']);
      },
    });
  }

  addToCart() {
    const product = this.productDetails();
    if (product) {
      this.cartService.addToCart(product.id, this.quantity()).subscribe({
        next: () => {
          this.toastr.success(
            `Added ${this.quantity()} unit(s) to cart successfully`
          );
          this.quantity.set(1);
        },
        error: (err) => {
          console.error('Error adding to cart:', err);
          this.toastr.error('Failed to add product to cart');
        },
      });
    }
  }

  increaseQuantity() {
  const product = this.productDetails();
  if (!product) return;

  this.cartService.addToCart(product.id, 1).subscribe({
    next: (res) => {
      // update local signal
      this.cartService.loadCart()
      this.quantity.set(res.quantity);
    },
    error: () => {
      this.toastr.error('Failed to increase quantity');
    }
  });
}

decreaseQuantity() {
  const product = this.productDetails();
  if (!product) return;

  const currentQuantity = this.quantity();
  if (currentQuantity > 1) {
    this.quantity.set(currentQuantity - 1); // تحديث فوري للـ UI
    
    this.cartService.decrement(product.id, 1).subscribe({
      next: () => {
        this.cartService.loadCart();
      },
      error: () => {
        // في حالة الفشل، أرجع للكمية السابقة
        this.quantity.set(currentQuantity);
        this.toastr.error('Failed to decrease quantity');
      }
    });
  }
}

  goBack() {
    this.router.navigate(['/dashboard/products']);
  }

  buyNow() {
  const product = this.productDetails();
  const qty = this.quantity();
  this.addToCart()

  if (!product) return;

  // 1️⃣ Add to cart
  this.cartService.addToCart(product.id, qty);

  // 2️⃣ Navigate to cart
  this.router.navigate(['/shopping-cart']);
}
checkout() {
  if (this.marketOpen() === false) {
    alert('Market is closed');
    return;
  }

  this.router.navigate(['/home']);
}
}