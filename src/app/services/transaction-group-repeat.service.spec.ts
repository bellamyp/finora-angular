import { TestBed } from '@angular/core/testing';

import { TransactionGroupRepeatService } from './transaction-group-repeat.service';

describe('TransactionGroupRepeatService', () => {
  let service: TransactionGroupRepeatService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TransactionGroupRepeatService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
