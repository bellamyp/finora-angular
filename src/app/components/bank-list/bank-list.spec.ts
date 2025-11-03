import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { CommonModule } from '@angular/common';

import { BankList } from './bank-list';
import { BankService } from '../../services/bank.service';
import { BankDto } from '../../dto/bank.dto';

describe('BankList', () => {
  let component: BankList;
  let fixture: ComponentFixture<BankList>;
  let mockBankService: jasmine.SpyObj<BankService>;

  beforeEach(async () => {
    mockBankService = jasmine.createSpyObj('BankService', ['getBanksByUserEmail']);

    await TestBed.configureTestingModule({
      imports: [BankList, CommonModule],
      providers: [
        { provide: BankService, useValue: mockBankService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(BankList);
    component = fixture.componentInstance;

    // Mock localStorage
    spyOn(localStorage, 'getItem').and.callFake((key: string) => {
      if (key === 'user') {
        return JSON.stringify({ email: 'user@example.com', role: 'ROLE_USER' });
      }
      return null;
    });

    const mockBanks: BankDto[] = [
      { id: '550e8400-e29b-41d4-a716-446655440006', name: 'Capital One Savings', type: 'SAVINGS', email: 'user@example.com' }
    ];

    mockBankService.getBanksByUserEmail.and.returnValue(of(mockBanks));

    fixture.detectChanges(); // triggers ngOnInit
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load banks for current user', () => {
    expect(component.banks.length).toBe(1);
    expect(component.banks[0].name).toBe('Capital One Savings');
    expect(component.banks[0].type).toBe('SAVINGS');
    expect(component.banks[0].email).toBe('user@example.com');
  });
});
