import { TestBed } from '@angular/core/testing';

import { GoldPricesService } from './gold-prices.service';

describe('GoldPricesService', () => {
  let service: GoldPricesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GoldPricesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
