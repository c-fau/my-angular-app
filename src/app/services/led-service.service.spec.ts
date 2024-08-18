import { TestBed } from '@angular/core/testing';

import { LedServiceService } from './led-service.service';

describe('LedServiceService', () => {
  let service: LedServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LedServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
