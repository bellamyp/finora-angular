import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BankGroupCreate } from './bank-group-create';

describe('BankGroupCreate', () => {
  let component: BankGroupCreate;
  let fixture: ComponentFixture<BankGroupCreate>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BankGroupCreate]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BankGroupCreate);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
