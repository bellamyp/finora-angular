import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ReportView } from './report-view';
import { of, throwError } from 'rxjs';
import { TransactionGroupService } from '../../services/transaction-group.service';
import { BankService } from '../../services/bank.service';
import { BrandService } from '../../services/brand.service';
import { LocationService } from '../../services/location.service';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { provideRouter } from '@angular/router';
import { Component } from '@angular/core';
import {BankDto} from '../../dto/bank.dto';
import {TransactionGroupDto} from '../../dto/transaction-group.dto';

// Dummy route component for provideRouter
@Component({ template: '', standalone: true })
class DummyComponent {}

describe('ReportView', () => {
  let component: ReportView;
  let fixture: ComponentFixture<ReportView>;

  let transactionGroupServiceSpy: jasmine.SpyObj<TransactionGroupService>;
  let bankServiceSpy: jasmine.SpyObj<BankService>;
  let brandServiceSpy: jasmine.SpyObj<BrandService>;
  let locationServiceSpy: jasmine.SpyObj<LocationService>;

  beforeEach(async () => {
    // Create spies for services
    transactionGroupServiceSpy = jasmine.createSpyObj('TransactionGroupService', ['getTransactionGroupsByReport']);
    bankServiceSpy = jasmine.createSpyObj('BankService', ['getBanks']);
    brandServiceSpy = jasmine.createSpyObj('BrandService', ['getBrandsByUser']);
    locationServiceSpy = jasmine.createSpyObj('LocationService', ['getLocations']);

    await TestBed.configureTestingModule({
      imports: [ReportView],
      providers: [
        { provide: TransactionGroupService, useValue: transactionGroupServiceSpy },
        { provide: BankService, useValue: bankServiceSpy },
        { provide: BrandService, useValue: brandServiceSpy },
        { provide: LocationService, useValue: locationServiceSpy },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: { paramMap: convertToParamMap({ id: 'r1' }) }
          }
        },
        provideRouter([{ path: 'dummy', component: DummyComponent }])
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ReportView);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load report groups successfully', fakeAsync(() => {
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
            posted: false // required
          }
        ]
      }
    ];

    const mockBanks: BankDto[] = [
      { id: 'b1', groupId: 'grp1', name: 'Bank 1', type: 'Checking', email: 'bank1@example.com' }
    ];

    const mockBrands = [
      { id: 'br1', name: 'Brand 1' } as any // if optional properties exist, cast as any OR add all required fields
    ];

    const mockLocations = [
      { id: 'l1', city: 'City', state: 'ST' } as any
    ];

    bankServiceSpy.getBanks.and.returnValue(of(mockBanks));
    brandServiceSpy.getBrandsByUser.and.returnValue(of(mockBrands));
    locationServiceSpy.getLocations.and.returnValue(of(mockLocations));
    transactionGroupServiceSpy.getTransactionGroupsByReport.and.returnValue(of(mockGroups));

    fixture.detectChanges();
    tick();

    expect(component.transactionGroups.length).toBe(1);
    expect(component.transactionGroups[0].transactions[0].bankName).toBe('Bank 1');
    expect(component.transactionGroups[0].transactions[0].brandName).toBe('Brand 1');
    expect(component.transactionGroups[0].transactions[0].locationName).toBe('City, ST');
    expect(component.loading).toBeFalse();
  }));

  it('should handle error when loading report groups', fakeAsync(() => {
    transactionGroupServiceSpy.getTransactionGroupsByReport.and.returnValue(throwError(() => new Error('Failed')));
    bankServiceSpy.getBanks.and.returnValue(of([]));
    brandServiceSpy.getBrandsByUser.and.returnValue(of([]));
    locationServiceSpy.getLocations.and.returnValue(of([]));

    const consoleSpy = spyOn(console, 'error');

    fixture.detectChanges();
    tick();

    expect(component.loading).toBeFalse();
    expect(consoleSpy).toHaveBeenCalled();
  }));
});
