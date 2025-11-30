import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { of } from 'rxjs';
import { CommonModule } from '@angular/common';

import { BankList } from './bank-list';
import { BankService } from '../../services/bank.service';
import { BankGroupService } from '../../services/bank-group.service';
import { BankDto } from '../../dto/bank.dto';
import { BankGroupDto } from '../../dto/bank-group.dto';

describe('BankList', () => {
  let component: BankList;
  let fixture: ComponentFixture<BankList>;
  let mockBankService: jasmine.SpyObj<BankService>;
  let mockBankGroupService: jasmine.SpyObj<BankGroupService>;

  beforeEach(async () => {
    mockBankService = jasmine.createSpyObj('BankService', ['getBanks']);
    mockBankGroupService = jasmine.createSpyObj('BankGroupService', ['getBankGroups']);

    await TestBed.configureTestingModule({
      imports: [BankList, CommonModule],
      providers: [
        { provide: BankService, useValue: mockBankService },
        { provide: BankGroupService, useValue: mockBankGroupService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(BankList);
    component = fixture.componentInstance;

    spyOn(localStorage, 'getItem').and.callFake((key: string) => {
      if (key === 'user') {
        return JSON.stringify({ email: 'user@example.com', role: 'ROLE_USER' });
      }
      return null;
    });

    const mockGroups: BankGroupDto[] = [
      { id: 'group1', name: 'Primary Account' }
    ];

    const mockBanks: BankDto[] = [
      {
        id: '550e8400-e29b-41d4-a716-446655440006',
        groupId: 'group1',
        name: 'Capital One Savings',
        type: 'SAVINGS',
        email: 'user@example.com',
        balance: 1200
      }
    ];

    mockBankGroupService.getBankGroups.and.returnValue(of(mockGroups));
    mockBankService.getBanks.and.returnValue(of(mockBanks));

    fixture.detectChanges(); // triggers ngOnInit
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load banks and replace groupId with Bank Group Name', () => {
    expect(component.banks.length).toBe(1);
    const bank = component.banks[0];
    expect(bank.name).toBe('Capital One Savings');
    expect(bank.type).toBe('SAVINGS');
    expect(bank.email).toBe('user@example.com');
    expect(bank.balance).toBe(1200);
    expect(bank.groupId).toBe('Primary Account'); // <- replaced group name
  });

  it('should call editBank when edit button clicked', () => {
    spyOn(window, 'alert');
    component.editBank(component.banks[0]);
    expect(window.alert).toHaveBeenCalledWith('Edit bank not implemented yet!');
  });

  it('should navigate to bank-view when view button clicked', () => {
    const routerSpy = spyOn(component['router'], 'navigate');
    component.viewBank(component.banks[0]);
    expect(routerSpy).toHaveBeenCalledWith(['/bank-view', component.banks[0].id]);
  });

  it('should handle empty bank list gracefully', fakeAsync(() => {
    mockBankGroupService.getBankGroups.and.returnValue(of([]));
    mockBankService.getBanks.and.returnValue(of([]));
    component.ngOnInit();
    tick();
    expect(component.banks.length).toBe(0);
    expect(component.loading).toBeFalse();
  }));

  it('should handle errors from bank or group services', fakeAsync(() => {
    spyOn(console, 'error');
    mockBankGroupService.getBankGroups.and.returnValue(of([{ id: 'g1', name: 'Group1' }]));
    mockBankService.getBanks.and.returnValue(of([]));
    component.ngOnInit();
    tick();
    expect(component.loading).toBeFalse();
    expect(component.error).toBeUndefined();
  }));
});
