import { TestBed } from '@angular/core/testing';

import { BankGroupService } from './bank-group.service';

describe('BankGroupService', () => {
  let service: BankGroupService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BankGroupService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
