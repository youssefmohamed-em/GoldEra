import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ConfigService } from './config.service';

@Injectable({
  providedIn: 'root',
})
export class AddressService {
    private http = inject(HttpClient);
  private config = inject(ConfigService);

    getUserAddresses() {
    return this.http.get(
      `${this.config.baseUrl}/public/user/addresses`
    );
  }
    addAddress(payload: any) {
    return this.http.post(
      `${this.config.baseUrl}/public/user/address`,
      payload
    );
  }

    selectCheckoutAddress(addressId: number) {
    return this.http.post(
      `${this.config.baseUrl}/public/checkout/select-address`,
      {
        addressId
      }
    );
  }
  
}
