import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BankView } from './bank-view';

describe('BankView', () => {
  let component: BankView;
  let fixture: ComponentFixture<BankView>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BankView]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BankView);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
