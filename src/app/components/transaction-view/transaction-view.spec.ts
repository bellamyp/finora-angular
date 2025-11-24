import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TransactionView } from './transaction-view';
import { TransactionGroupService } from '../../services/transaction-group.service';
import { BankService } from '../../services/bank.service';
import { BrandService } from '../../services/brand.service';
import { of } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { TransactionResponseDto, TransactionGroupDto } from '../../dto/transaction-group.dto';
import { BankDto } from '../../dto/bank.dto';
import { BrandDto } from '../../dto/brand.dto';

describe('TransactionView', () => {
  let component: TransactionView;
  let fixture: ComponentFixture<TransactionView>;

  let mockTransactionGroupService: jasmine.SpyObj<TransactionGroupService>;
  let mockBankService: jasmine.SpyObj<BankService>;
  let mockBrandService: jasmine.SpyObj<BrandService>;

  beforeEach(async () => {
    mockTransactionGroupService = jasmine.createSpyObj('TransactionGroupService', ['getTransactionGroupById']);
    mockBankService = jasmine.createSpyObj('BankService', ['getBanks']);
    mockBrandService = jasmine.createSpyObj('BrandService', ['getBrandsByUser']);

    // Mock ActivatedRoute with a paramMap
    const mockActivatedRoute = {
      snapshot: {
        paramMap: {
          get: () => 'group123'
        }
      }
    };

    await TestBed.configureTestingModule({
      imports: [TransactionView],
      providers: [
        { provide: TransactionGroupService, useValue: mockTransactionGroupService },
        { provide: BankService, useValue: mockBankService },
        { provide: BrandService, useValue: mockBrandService },
        { provide: ActivatedRoute, useValue: mockActivatedRoute }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(TransactionView);
    component = fixture.componentInstance;

    // Mock service responses
    const mockTransactions: TransactionResponseDto[] = [
      {
        id: 'tx1',
        date: '2025-11-24',
        amount: 100,
        notes: 'Test',
        bankId: 'b1',
        brandId: 'br1',
        typeId: 'INCOME',
        posted: true,
        groupId: 'group123'
      }
    ];

    const mockGroup: TransactionGroupDto = {
      id: 'group123', // <-- must include id to match interface
      transactions: mockTransactions
    };

    const mockBanks: BankDto[] = [
      { id: 'b1', name: 'Bank1', type: 'CHECKING', email: 'user@example.com' }
    ];

    const mockBrands: BrandDto[] = [
      { id: 'br1', name: 'Brand1', location: 'NY' }
    ];

    // Return mocks
    mockTransactionGroupService.getTransactionGroupById.and.returnValue(of(mockGroup));
    mockBankService.getBanks.and.returnValue(of(mockBanks));
    mockBrandService.getBrandsByUser.and.returnValue(of(mockBrands));

    fixture.detectChanges(); // triggers ngOnInit
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load transactions, banks, and brands on init', () => {
    expect(component.transactions.length).toBe(1);
    expect(component.transactions[0].id).toBe('tx1');
    expect(component.banks.length).toBe(1);
    expect(component.brands.length).toBe(1);
    expect(component.groupId).toBe('group123');
    expect(component.loading).toBeFalse();
  });

  it('should return correct bank name', () => {
    expect(component.getBankName('b1')).toBe('Bank1');
    expect(component.getBankName('unknown')).toBe('unknown');
  });

  it('should return correct brand name', () => {
    expect(component.getBrandName('br1')).toBe('Brand1 (NY)');
    expect(component.getBrandName('unknown')).toBe('unknown');
  });
});
