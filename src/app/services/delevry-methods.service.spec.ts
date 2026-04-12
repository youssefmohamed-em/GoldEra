import { TestBed } from '@angular/core/testing';

import { DelevryMethodsService } from './delevry-methods.service';

describe('DelevryMethodsService', () => {
  let service: DelevryMethodsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DelevryMethodsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
