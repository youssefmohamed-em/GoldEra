import { Component, inject, signal } from '@angular/core';
import { ProductCategory, ProductCategoryService, ProductDetails, ProductsResponse } from '../../services/product-category.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { DecimalPipe } from '@angular/common';
import { CartComponent } from '../cart/cart.component';
import { CartItemService } from '../../services/cart-item.service';
import { Product } from '../../services/product-category.service';

@Component({
  selector: 'app-products',
  imports: [CartComponent,DecimalPipe],
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss',
})
export class ProductsComponent {

  private categoriesService = inject(ProductCategoryService);
  private  cartitem = inject (CartItemService);
  private toastr = inject(ToastrService);
  private router = inject(Router);
  previewProducts = signal<Product[]>([]);
  categories = signal<ProductCategory[]>([]);
  loading = signal(true);
  marketOpen = signal<boolean | null>(null);
  
  previewPrices = signal<{ [key: number]: number }>({});
  products = signal<Product[]>([]);
  private productdetail= signal<ProductDetails | null>(null);

  ngOnInit(): void {
    this.getProducts()
      this.cartitem.loadMarketStatus().subscribe({
    next: (res) => {
      this.marketOpen.set(res.value === 'true');
    },
    error: (err) => {
      console.error('MARKET STATUS ERROR 👉', err);
    }
  });
  }

  

 
  getProducts() {
  this.categoriesService.getProducts().subscribe({
    next: (res: ProductsResponse) => {
      this.products.set(res.items);
        this.previewProducts.set(res.items.slice(0, 2));
      this.loading.set(false);

    },
    error: (err) => {
      console.error(err);
      this.loading.set(false);
    },
  });
}
add(productId: number) {
  this.cartitem.addToCart(productId, 1).subscribe({
    next: (res) => {
      console.log('Added to cart', res);
      this.toastr.success('Add To cart Successfully ');
      

    },
    error: (err) => {
      console.error('Error', err);
      this.toastr.error('something error , please try later !');
    }
  });

}
viewDetails(slug: string) {
  this.router.navigate(['/dashboard/productDetails', slug]);
  console.log(slug);
  
}
checkout() {
  if (this.marketOpen() === false) {
    alert('Market is closed');
    return;
  }

  this.router.navigate(['/checkout']);
}
}
