import { TestBed } from '@angular/core/testing';

import { HidServiceService } from './hid-service.service';

describe('HidServiceService', () => {
  let service: HidServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HidServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
