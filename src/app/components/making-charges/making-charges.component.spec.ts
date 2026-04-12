import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MakingChargesComponent } from './making-charges.component';

describe('MakingChargesComponent', () => {
  let component: MakingChargesComponent;
  let fixture: ComponentFixture<MakingChargesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MakingChargesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MakingChargesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
