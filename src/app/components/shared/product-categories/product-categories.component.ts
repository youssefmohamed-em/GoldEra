import { Component, inject, signal, OnInit } from '@angular/core';
import { ProductCategory, ProductCategoryService, ProductsResponse, Product } from '../../../services/product-category.service';
import { DecimalPipe } from '@angular/common';
import { CartItemService } from '../../../services/cart-item.service';
import { ToastrService } from 'ngx-toastr';
import { CartComponent } from "../../cart/cart.component";
import { Router } from '@angular/router';

@Component({
  selector: 'app-product-categories',
  templateUrl: './product-categories.component.html',
  styleUrl: './product-categories.component.scss',
  imports: [DecimalPipe, CartComponent],
})
export class ProductCategoriesComponent implements OnInit {

  private categoriesService = inject(ProductCategoryService);
  private cartitem = inject(CartItemService);
  private toastr = inject(ToastrService);
  private router = inject(Router);

  previewProducts = signal<Product[]>([]);
  categories = signal<ProductCategory[]>([]);
  loading = signal(true);
  previewPrices = signal<{ [key: number]: number }>({});
  products = signal<Product[]>([]);

  ngOnInit(): void {
    this.getProducts();
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
        this.toastr.success('Add To cart Successfully');
      },
      error: (err) => {
        console.error('Error', err);
        this.toastr.error('Something went wrong, please try later!');
      }
    });
  }

  goToAllProducts() {
    this.router.navigate(['/dashboard/products']);
  }

  viewDetails(slug: string) {
    this.router.navigate(['/dashboard/productDetails', slug]);
  }
}