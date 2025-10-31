import { TestBed } from '@angular/core/testing';

import { TreatErrorMessageService } from './treat-error-message.service';

describe('TreatErrorMessageService', () => {
  let service: TreatErrorMessageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TreatErrorMessageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
