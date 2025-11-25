import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransactionRepeatList } from './transaction-repeat-list';

describe('TransactionRepeatList', () => {
  let component: TransactionRepeatList;
  let fixture: ComponentFixture<TransactionRepeatList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TransactionRepeatList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TransactionRepeatList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
