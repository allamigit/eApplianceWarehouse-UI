import { TestBed } from '@angular/core/testing';

import { GetStockService } from './get-stock.service';

describe('GetStockService', () => {
  let service: GetStockService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GetStockService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
