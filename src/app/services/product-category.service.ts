import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from './config.service';
import { Observable } from 'rxjs';

export interface ProductCategory {
  id: number;
  nameEn: string;
  nameAr: string;
  descriptionEn: string | null;
  descriptionAr: string | null;
  imageUrl: string;
  createdAt: string;
  updatedAt: string;
  slugAr: string;
  slugEn: string;
}

export interface CategoryResponse {
  items: ProductCategory[];
}

export interface ProductDetails {
  id: number;
  nameAr: string;
  nameEn: string;
  descriptionEn: string | null;
  descriptionAr: string | null;
  weightValue: number;
  weightUnit: string;
  purity: string;
  imageUrl: string;
  currentSellPrice: number;
  price: number;
  isActive: boolean;
  slugEn: string;
  slugAr?: string;
  category: {
    id: number;
    nameAr: string;
    nameEn: string;
    descriptionEn: string | null;
    descriptionAr: string | null;
  };
  productType: {
    id: number;
    nameAr: string;
    nameEn: string;
    descriptionEn: string | null;
    descriptionAr: string | null;
  };
}

export interface Product {
  id: number;
  nameEn: string;
  nameAr: string;
  descriptionEn: string | null;
  descriptionAr: string | null;
  imageUrl: string;
  currentSellPrice: number;
  weightValue: number;
  weightUnit: string;
  purity: string;
  slugEn: string;
  slugAr?: string;
  category: ProductCategory;
}

export interface ProductPreview {
  id: number;
  nameEn: string;
  nameAr: string;
  descriptionEn: string | null;
  descriptionAr: string | null;
  imageUrl: string;
  currentSellPrice: number;
  weightValue: number;
  weightUnit: string;
  purity: string;
  slugEn: string;
}

export interface ProductsResponse {
  items: Product[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class ProductCategoryService {
  private http = inject(HttpClient);
  private config = inject(ConfigService);

  private categoryendpoint = '/public/product-categories';
  private productsendpoint = '/public/products/preview-price';

  getCategories(): Observable<ProductCategory[]> {
    return this.http.get<ProductCategory[]>(
      `${this.config.baseUrl}${this.categoryendpoint}`
    );
  }

  getProducts(): Observable<ProductsResponse> {
    return this.http.get<ProductsResponse>(
      `${this.config.baseUrl}/public/products/price?page=0&size=8`
    );
  }

  getProductBySlug(slug: string): Observable<ProductDetails> {
    return this.http.get<ProductDetails>(
      `${this.config.baseUrl}/public/products/slug/${slug}`
    );
  }
}