import { TestBed } from '@angular/core/testing';

import { DataAPIService } from './data-api.service';

describe('DataAPIService', () => {
  let service: DataAPIService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DataAPIService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
