import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from './config.service';
import { Observable } from 'rxjs';

export interface OrderDetails {
  id: number;
  orderNumber: string;
  status: string;
  paymentStatus: string;
  fulfillmentType: string;
  deliveryStatus: string;

  subtotal: number;
  shippingCost: number;
  paidAmount: number;

  createdAt: string;
  updatedAt: string;

  user: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };

  userAddress: {
    fullName: string;
    phone: string;
    street: string;
    country: { nameEn: string };
    state: { nameEn: string };
    city: { nameEn: string };
  };

  paymentMethod: {
    nameEn: string;
  };

  cart: {
    cartItems: {
      quantity: number;
      unitPrice: number;
      totalPrice: number;
      product: {
        nameEn: string;
        imageUrl: string;
        weightValue: number;
      };
    }[];
  };
}

export interface OrdersResponse {
  content: Order[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
  last: boolean;
}

export interface Order {
  id: number;
  orderNumber: string;
  status: string;
  paymentStatus: string;
  createdAt: string;
  subtotal: number;
  paidAmount: number;

  user: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };

  userAddress: {
    fullName: string;
    street: string;
    city: { nameEn: string };
    state: { nameEn: string };
  };

  paymentMethod: {
    nameEn: string;
  };
}
@Injectable({
  providedIn: 'root',
})
export class OrderHistoryService {

  private http = inject (HttpClient); 
  private config = inject (ConfigService);

  getUserOrders(
  page: number = 0,
  size: number = 10,
  sortBy: string = 'createdAt',
  sortDirection: 'ASC' | 'DESC' = 'DESC'
): Observable<OrdersResponse> {

  const url =
    `${this.config.baseUrl}/protected/orders/user` +
    `?sortDirection=${sortDirection}` +
    `&sortBy=${sortBy}` +
    `&size=${size}` +
    `&page=${page}`;

  return this.http.get<OrdersResponse>(url);
}
 getOrderDetails(orderId: number): Observable<OrderDetails> {
  return this.http.get<any>(
    `${this.config.baseUrl}/protected/orders/details/${orderId}`
  );
}
}
