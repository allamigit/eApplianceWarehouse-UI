import { TestBed } from '@angular/core/testing';

import { AccessGroupGuard } from './access-group.guard';

describe('AccessGroupGuard', () => {
  let guard: AccessGroupGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(AccessGroupGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
