import { TestBed } from '@angular/core/testing';

import { VotethingService } from './votething.service';

describe('VotethingService', () => {
  let service: VotethingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VotethingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
