import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ReportView } from './report-view';
import { of, throwError } from 'rxjs';
import { TransactionGroupService } from '../../services/transaction-group.service';
import { BankService } from '../../services/bank.service';
import { BrandService } from '../../services/brand.service';
import { LocationService } from '../../services/location.service';
import { ReportService } from '../../services/report.service';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { provideRouter } from '@angular/router';
import { Component } from '@angular/core';
import { BankDto } from '../../dto/bank.dto';
import { TransactionGroupDto } from '../../dto/transaction-group.dto';
import { ReportDto } from '../../dto/report.dto';

@Component({ template: '', standalone: true })
class DummyComponent {}

describe('ReportView', () => {
  let component: ReportView;
  let fixture: ComponentFixture<ReportView>;

  let transactionGroupServiceSpy: jasmine.SpyObj<TransactionGroupService>;
  let bankServiceSpy: jasmine.SpyObj<BankService>;
  let brandServiceSpy: jasmine.SpyObj<BrandService>;
  let locationServiceSpy: jasmine.SpyObj<LocationService>;
  let reportServiceSpy: jasmine.SpyObj<ReportService>;

  beforeEach(async () => {
    transactionGroupServiceSpy = jasmine.createSpyObj('TransactionGroupService', [
      'getTransactionGroupsByReport'
    ]);
    bankServiceSpy = jasmine.createSpyObj('BankService', ['getBanks']);
    brandServiceSpy = jasmine.createSpyObj('BrandService', ['getBrandsByUser']);
    locationServiceSpy = jasmine.createSpyObj('LocationService', ['getLocations']);
    reportServiceSpy = jasmine.createSpyObj('ReportService', [
      'canAddTransactionGroups',
      'getReportById',
      'addTransactionGroups',
      'removeReportFromGroup',
      'getReportTypeBalances',
      'getReportBankBalances',
      'postReport'
    ]);

    await TestBed.configureTestingModule({
      imports: [ReportView, DummyComponent],
      providers: [
        { provide: TransactionGroupService, useValue: transactionGroupServiceSpy },
        { provide: BankService, useValue: bankServiceSpy },
        { provide: BrandService, useValue: brandServiceSpy },
        { provide: LocationService, useValue: locationServiceSpy },
        { provide: ReportService, useValue: reportServiceSpy },
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { paramMap: convertToParamMap({ id: 'r1' }) } }
        },
        provideRouter([{ path: 'dummy', component: DummyComponent }])
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ReportView);
    component = fixture.componentInstance;
  });

  function mockCommonReportCalls(posted = false) {
    reportServiceSpy.getReportById.and.returnValue(
      of({
        id: 'r1',
        userId: 'u1',
        month: '2025-12',
        posted
      } as ReportDto)
    );

    reportServiceSpy.canAddTransactionGroups.and.returnValue(of(!posted));
    reportServiceSpy.getReportTypeBalances.and.returnValue(of([]));
    reportServiceSpy.getReportBankBalances.and.returnValue(of([]));
  }

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load report groups with mapped names', fakeAsync(() => {
    const mockGroups: TransactionGroupDto[] = [
      {
        id: 'g1',
        transactions: [
          {
            id: 't1',
            bankId: 'b1',
            brandId: 'br1',
            locationId: 'l1',
            date: '2025-11-01',
            typeId: 'type1',
            notes: 'note',
            amount: 100,
            posted: false
          }
        ]
      }
    ];

    const mockBanks: BankDto[] = [
      { id: 'b1', groupId: 'grp1', name: 'Bank 1', type: 'Checking', email: '' }
    ];

    bankServiceSpy.getBanks.and.returnValue(of(mockBanks));
    brandServiceSpy.getBrandsByUser.and.returnValue(of([{ id: 'br1', name: 'Brand 1' } as any]));
    locationServiceSpy.getLocations.and.returnValue(
      of([{ id: 'l1', city: 'City', state: 'ST' } as any])
    );
    transactionGroupServiceSpy.getTransactionGroupsByReport.and.returnValue(of(mockGroups));

    mockCommonReportCalls(false);

    fixture.detectChanges();
    tick();

    const tx = component.transactionGroups[0].transactions[0];
    expect(tx.bankName).toBe('Bank 1');
    expect(tx.brandName).toBe('Brand 1');
    expect(tx.locationName).toBe('City, ST');
    expect(component.canAddTransactionGroups).toBeTrue();
    expect(component.reportPosted).toBeFalse();
    expect(component.loading).toBeFalse();
  }));

  it('should handle load report groups error', fakeAsync(() => {
    transactionGroupServiceSpy.getTransactionGroupsByReport.and.returnValue(
      throwError(() => new Error('Fail'))
    );
    bankServiceSpy.getBanks.and.returnValue(of([]));
    brandServiceSpy.getBrandsByUser.and.returnValue(of([]));
    locationServiceSpy.getLocations.and.returnValue(of([]));

    mockCommonReportCalls(false);

    const consoleSpy = spyOn(console, 'error');

    fixture.detectChanges();
    tick();

    expect(component.loading).toBeFalse();
    expect(consoleSpy).toHaveBeenCalled();
  }));

  it('getAmountDisplay() should return correct classes and display', () => {
    expect(component.getAmountDisplay({ amount: 50 })).toEqual({
      display: '$50.00',
      classes: { 'text-success': true, 'text-danger': false }
    });

    expect(component.getAmountDisplay({ amount: -20 })).toEqual({
      display: '$-20.00',
      classes: { 'text-success': false, 'text-danger': true }
    });

    expect(component.getAmountDisplay({ amount: null })).toEqual({
      display: '—',
      classes: {}
    });
  });

  it('getLoadTransactionsText() should return correct text', () => {
    component.canAddTransactionGroups = true;
    expect(component.getLoadTransactionsText()).toBe('Load all available transactions');

    component.canAddTransactionGroups = false;
    expect(component.getLoadTransactionsText()).toBe(
      'No fully posted transactions to add'
    );
  });

  it('removeGroupFromReport() should do nothing if report is posted', () => {
    component.reportPosted = true;
    const group: TransactionGroupDto = { id: 'g1', transactions: [] };

    component.removeGroupFromReport(group);

    expect(reportServiceSpy.removeReportFromGroup).not.toHaveBeenCalled();
  });
});
