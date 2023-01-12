import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaleOrderItemsComponent } from './sale-order-items.component';

describe('SaleOrderItemsComponent', () => {
  let component: SaleOrderItemsComponent;
  let fixture: ComponentFixture<SaleOrderItemsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SaleOrderItemsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SaleOrderItemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
