import { Injectable , inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
 import { ConfigService } from './config.service';
import { Observable, tap } from 'rxjs';


export interface ProductType {
  id: number;
  nameAr: string;
  nameEn: string;
}
export interface CartItem {
  id: number;
  cartId: number;
  product: Product;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface Product {
  id: number;
  nameAr: string;
  nameEn: string;
  imageUrl: string;
  weightValue: number;
  purity: string;
}
@Injectable({
  providedIn: 'root',
})
export class CartItemService {
private http = inject ( HttpClient);
private  config = inject (ConfigService);

cart = signal<CartItem[]> ([]);
productTypes = signal<ProductType[]>([]);
loading = signal (false);
cartCount = signal(0);
cartVisible = signal(false);
marketOpen = signal<boolean | null>(null);
cartId = signal<number | null>(null);

private get baseUrl(){
    return  `${this.config.baseUrl}/public/cart-items`;
}

private updateCount(items: CartItem[]) {
  const total = items.reduce((sum, item) => sum + item.quantity, 0);
  this.cartCount.set(total);
}


loadProductTypes() {
  this.http.get<ProductType[]>(`${this.config.baseUrl}/public/product-type`)
    .subscribe({
      next: (res) => {
        console.log('PRODUCT TYPES 👉', res);
        this.productTypes.set(res);
      },
      error: (err) => {
        console.error('PRODUCT TYPES ERROR 👉', err);
      }
    });
}
 loadCart() {
  this.loading.set(true);

  this.http.get<CartItem[]>(`${this.baseUrl}`).subscribe({
    next: (res) => {
      this.cart.set(res);

      // ✅ IMPORTANT FIX
      if (res.length > 0) {
        this.cartId.set(res[0].cartId);
      }

      this.updateCount(res);
      this.loading.set(false);
    },
    error: () => this.loading.set(false)
  });
}
addToCart(productId: number, quantity: number = 1): Observable<CartItem> {
  return this.http.post<CartItem>(`${this.baseUrl}/add`, {
    productId,
    quantity
  }).pipe(
    tap((newItem) => {

      // ✅ إظهار الأيقونة
      this.cartVisible.set(true);

      this.cart.update((items) => {
        const existing = items.find(i => i.product.id === newItem.product.id);

        let updated: CartItem[];

        if (existing) {
          // ✅ تحديث المنتج الموجود
          updated = items.map(i =>
            i.product.id === newItem.product.id
              ? { ...i, quantity: newItem.quantity, totalPrice: newItem.totalPrice }
              : i
          );
        } else {
          // ✅ إضافة منتج جديد
          updated = [...items, newItem];
        }

        // ✅ تحديث العدد (مهم جدًا)
        this.updateCount(updated);

        return updated;
      });

    })
  );
}
decrement(productId: number, quantity: number = 1): Observable<CartItem> {
  return this.http.post<CartItem>(`${this.baseUrl}/decrement/${productId}`, { quantity }).pipe(
    tap((updatedItem) => {
      console.log('DECREMENT RESPONSE:', updatedItem); // ✅ للـ debug
      
      this.cart.update(items => {
        const updated = items
          .map(i => i.product.id === productId 
            ? { ...i, quantity: updatedItem.quantity, totalPrice: updatedItem.totalPrice }
            : i
          )
          .filter(i => i.quantity > 0);
          
        this.updateCount(updated);
        return updated;
      });
    })
  );
}
remove(itemId: number): Observable<any> {  // ✅ أضفنا return type
  return this.http.delete(`${this.baseUrl}/${itemId}`).pipe(
    tap(() => {
      this.cart.update(items => {
        const updated = items.filter(i => i.id !== itemId);

        this.updateCount(updated);

        return updated;
      });
    })
  );  // ❌ حذفنا .subscribe() - الـ component هي اللي تعمله
}

loadMarketStatus(): Observable<{ key: string; value: string }> {
  return this.http.get<{ key: string; value: string }>(
    `${this.config.baseUrl}/public/settings/marketStatus`
  );
}


}
