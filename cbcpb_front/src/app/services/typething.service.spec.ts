import { TestBed } from '@angular/core/testing';

import { TypethingService } from './typething.service';

describe('TypethingService', () => {
  let service: TypethingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TypethingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
