import { TestBed } from '@angular/core/testing';

import { RestrictRoutesGuard } from './restrict-routes.guard';

describe('RestrictRoutesGuard', () => {
  let guard: RestrictRoutesGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(RestrictRoutesGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
