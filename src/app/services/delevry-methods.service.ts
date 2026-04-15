import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ConfigService } from './config.service';

@Injectable({
  providedIn: 'root',
})
export class DelevryMethodsService {
  
private http = inject(HttpClient);
private config= inject(ConfigService);


  getDeliveryMethods() {
  return this.http.get<any>(`${this.config.baseUrl}/public/delivery-methods`);
}
 getDeliveryMethodsByStateZone(stateId: number) {
    return this.http.get<any[]>(
      `${this.config.baseUrl}/public/delivery-methods/state-zone/${stateId}`
    );
  }
   getDeliveryMethodById(id: number) {
    return this.http.get<any>(
      `${this.config.baseUrl}/public/delivery-methods/${id}`
    );
  }
    getStatesByCountry(
  countryId: number,
  page: number = 0,
  size: number = 1000,
  sortBy: string = 'id',
  direction: string = 'asc'
) {
  return this.http.get<any>(
    `${this.config.baseUrl}/public/geographic/states/country/${countryId}`,
    {
      params: {
        page,
        size,
        sortBy,
        direction
      }
    }
  );
}
getCitiesByState(
  stateId: number,
  page: number = 0,
  size: number = 1000,
  sortBy: string = 'id',
  direction: string = 'asc'
) {
  return this.http.get<any>(
    `${this.config.baseUrl}/public/geographic/cities/state/${stateId}`,
    {
      params: {
        page,
        size,
        sortBy,
        direction
      }
    }
  );
}
initOrder(payload: any) {
  return this.http.post(
    `${this.config.baseUrl}/protected/orders/init`,
    payload
  );
}
    getCountries() {
    return this.http.get<any>(
      `${this.config.baseUrl}/public/geographic/countries`
    );
  }
    getStateZone(stateId: number) {
    return this.http.get<any>(
      `${this.config.baseUrl}/public/geographic/state-zone/${stateId}`
    );
  }
}
