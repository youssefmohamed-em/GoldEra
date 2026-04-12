import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ConfigService } from './config.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PaymentMethodsService {
   private http = inject(HttpClient);
    private config = inject(ConfigService);


   getPaymentMethods(): Observable<any> {
    return this.http.get(
      `${this.config.baseUrl}/public/payment-methods`
    );
  }
}
