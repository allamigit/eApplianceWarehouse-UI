import { TestBed } from '@angular/core/testing';

import { SaleOrderItemsService } from './sale-order-items.service';

describe('SaleOrderItemsService', () => {
  let service: SaleOrderItemsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SaleOrderItemsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
