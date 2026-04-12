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
}
