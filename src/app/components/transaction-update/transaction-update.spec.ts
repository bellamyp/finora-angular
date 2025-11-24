import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransactionUpdate } from './transaction-update';

describe('TransactionUpdate', () => {
  let component: TransactionUpdate;
  let fixture: ComponentFixture<TransactionUpdate>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TransactionUpdate]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TransactionUpdate);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
