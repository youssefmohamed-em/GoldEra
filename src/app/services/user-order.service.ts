import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from './config.service';
import { Observable } from 'rxjs';


export interface OrdersResponse {
  content: Order[];
  totalElements: number;
  totalPages: number;
}

export interface Order {
  id: number;
  orderNumber: string;
  status: string;
  paymentStatus: string;
  deliveryStatus: string;
  subtotal: number;
  shippingCost: number;
  paidAmount: number;
  createdAt: string;
}
@Injectable({
  providedIn: 'root',
})
export class UserOrderService {
    private http = inject(HttpClient);
  private config = inject(ConfigService);
  

    getOrderByNumber(orderNumber: string): Observable<OrdersResponse> {
    return this.http.get<OrdersResponse>(
      `${this.config.baseUrl}/protected/orders/user`,
      {
        params: { orderNumber }
      }
    );
  };
  verifyOrder(orderNumber: string, file: File): Observable<any> {
  const formData = new FormData();
  formData.append('paymentAtt', file);

  return this.http.post(
    `${this.config.baseUrl}/protected/orders/${orderNumber}/verify`,
    formData
  );
}
}
