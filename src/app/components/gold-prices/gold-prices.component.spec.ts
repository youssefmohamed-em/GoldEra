import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GoldPricesComponent } from './gold-prices.component';

describe('GoldPricesComponent', () => {
  let component: GoldPricesComponent;
  let fixture: ComponentFixture<GoldPricesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GoldPricesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GoldPricesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
