import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ConfigService } from './config.service';

export interface UserProfile {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  role: string;
  status: string;
  dateOfBirth: string;
  nationality: string;
  createdAt: string;
  updatedAt: string;
  lastLoginAt: string;
}
export interface LastOrder {
  id: number;
  status: string;
  createdAt: string;
  orderNumber: string;
  totalAmount: number | null;
}
export interface UserProfileOverview {
  userId: number;
  firstName: string;
  lastName: string;
  phone: string;
  nationality: string;
  email: string;
  lastLoginAt: string;
  createdAt: string;
  totalOrders: number;
  totalSpent: number;
  last3Orders: LastOrder[];
  status: string;
}
export interface PagedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
}
export interface Order {
  id: number;
  status: string;
  createdAt: string;
  orderNumber: string;
  totalAmount: number | null;
  // أضف أي حقول أخرى تأتي من الـ API مثل subtotal لو موجود
}

export interface UserAddress {
  id: number | null;
  fullName: string;
  phone: string;
  street: string;
  postalCode: string;

  country: {
    id: number;
    nameAr: string;
    nameEn: string;
  };

  state: {
    id: number;
    nameAr: string;
    nameEn: string;
  };

  city: {
    id: number;
    nameAr: string;
    nameEn: string;
  };
   isDefault?: boolean;
}
@Injectable({
  providedIn: 'root',
})
export class ProfileUserService {

  private http = inject(HttpClient);
  private config = inject(ConfigService);
  private baseUrl = this.config.baseUrl;

  getUserAddresses(userId: number): Observable<UserAddress[]> {
    return this.http.get<UserAddress[]>(
      `${this.baseUrl}/protected/user-addresses/${userId}/by-user`
    );
  }
getUserOverview(userId: number): Observable<PagedResponse<any>> {
  return this.http.get<PagedResponse<any>>(
    `${this.baseUrl}/protected/user-profiles/${userId}/overview`
  );
}
  getUserProfile(userId: number): Observable<UserProfile> {
    return this.http.get<UserProfile>(
      `${this.baseUrl}/protected/user-profiles/${userId}`
    );
  }
}
