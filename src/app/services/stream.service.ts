import { inject, Injectable, NgZone } from '@angular/core';
import { ConfigService } from './config.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class StreamService {
    private eventSource?: EventSource;
    private config = inject (ConfigService);
    private zone = inject (NgZone);


    connect(): Observable<any> {

    const url = `${this.config.baseUrl}/public/gold-prices/stream`;

    return new Observable((observer) => {

      this.eventSource = new EventSource(url);

      this.eventSource.onmessage = (event) => {
        this.zone.run(() => {
          try {
            observer.next(JSON.parse(event.data));
          } catch (e) {
            observer.error('Invalid JSON from stream');
          }
        });
      };

      this.eventSource.onerror = (error) => {
        this.zone.run(() => {
          observer.error(error);
        });

        this.disconnect(); // اقفل الاتصال
      };

      // cleanup لما الـ subscriber يقفل
      return () => {
        this.disconnect();
      };
    });
  }

  disconnect() {
    if (this.eventSource) {
      this.eventSource.close();
      this.eventSource = undefined;
    }
  }
}
