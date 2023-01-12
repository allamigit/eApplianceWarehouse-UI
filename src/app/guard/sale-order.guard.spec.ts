import { TestBed } from '@angular/core/testing';

import { SaleOrderGuard } from './sale-order.guard';

describe('OrdersListGuard', () => {
  let guard: SaleOrderGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(SaleOrderGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
