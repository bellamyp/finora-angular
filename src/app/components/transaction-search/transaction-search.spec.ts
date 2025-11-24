import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransactionSearch } from './transaction-search';

describe('TransactionSearch', () => {
  let component: TransactionSearch;
  let fixture: ComponentFixture<TransactionSearch>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TransactionSearch]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TransactionSearch);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
