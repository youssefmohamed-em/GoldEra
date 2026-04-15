import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ConfigService } from './config.service';
interface AddressEditForm {
  fullName: string;
  street: string;
  phone: string;
  postalCode: string;
  specialInstructions?: string;
  countryId?: number | null;
  stateId?: number | null;
  cityId?: number | null;
}
export interface AddressResponse {
  id: number;
  userId: number;
  type: string;
  fullName: string;
  phone: string;
  street: string;
  country: {
    id: number;
    nameAr: string;
    nameEn: string;
    code: string;
  };
  state: {
    id: number;
    nameAr: string;
    nameEn: string;
    code: string;
  };
  city: {
    id: number;
    nameAr: string;
    nameEn: string;
    code: string;
  };
  postalCode: string;
  isDefault: boolean;
  specialInstructions: string;
  createdAt: string;
  updatedAt: string;
}
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
  getCountries() {
  return this.http.get<any>(
    `${this.config.baseUrl}/public/geographic/countries`
  );
}

  getUserAddressesByUser(userId: number) {
  return this.http.get(
    `${this.config.baseUrl}/protected/user-addresses/${userId}/by-user`
  );
}
updateAddress(addressId: number, payload: any) {
  return this.http.put(
    `${this.config.baseUrl}/protected/user-addresses/${addressId}`,
    payload
  );
}
deleteAddress(addressId: number) {
  return this.http.delete(
    `${this.config.baseUrl}/protected/user-addresses/${addressId}`
  );
}
}
