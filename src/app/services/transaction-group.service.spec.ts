import { TestBed } from '@angular/core/testing';

import { TransactionGroupService } from './transaction-group.service';

describe('TransactionGroupService', () => {
  let service: TransactionGroupService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TransactionGroupService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
