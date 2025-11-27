import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { CommonModule, NgClass } from '@angular/common';
import { BankService } from '../../services/bank.service';
import { BrandService } from '../../services/brand.service';
import { LocationService } from '../../services/location.service';
import { TransactionTypeEnum } from '../../dto/transaction-type.enum';
import { enumToOptions } from '../../utils/enum-utils';
import { BankDto } from '../../dto/bank.dto';
import { BrandDto } from '../../dto/brand.dto';
import { LocationDto } from '../../dto/location.dto';
import { TransactionTypeOption } from '../../dto/transaction-type.dto';
import { TransactionSearchDto } from '../../dto/transaction-search.dto';
import { TransactionService } from '../../services/transaction.service';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-transaction-search',
  standalone: true,
  imports: [ReactiveFormsModule, NgClass, CommonModule],
  templateUrl: './transaction-search.html',
  styleUrls: ['./transaction-search.scss'],
})
export class TransactionSearch implements OnInit {

  searchForm!: FormGroup;
  results: any[] = [];
  searched = false;
  loading = false;

  banks: BankDto[] = [];
  brands: BrandDto[] = [];
  locations: LocationDto[] = [];
  transactionTypes: TransactionTypeOption[] = [];

  locationMap: Record<string, string> = {};

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private bankService: BankService,
    private brandService: BrandService,
    private locationService: LocationService,
    private transactionService: TransactionService
  ) {}

  ngOnInit(): void {
    const today = new Date();
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const format = (d: Date) => d.toISOString().substring(0, 10);

    this.searchForm = this.fb.group({
      startDate: [format(firstDayOfMonth)],
      endDate: [format(today)],
      minAmount: [''],
      maxAmount: [''],
      bankId: [''],
      brandId: [''],
      locationId: [''],
      typeId: [''],
      keyword: [''],
    });

    // Load all data in parallel
    forkJoin({
      banks: this.bankService.getBanks(),
      brands: this.brandService.getBrandsByUser(),
      locations: this.locationService.getLocations()
    }).subscribe({
      next: ({ banks, brands, locations }) => {
        this.banks = banks;
        this.brands = brands;
        this.locations = locations;

        // Map for easy lookup
        this.locationMap = locations.reduce((map: Record<string, string>, loc: LocationDto) => {
          map[loc.id] = `${loc.city}, ${loc.state}`;
          return map;
        }, {});
      },
      error: (err) => console.error('Load master data error:', err)
    });

    this.transactionTypes = enumToOptions(TransactionTypeEnum);

    // Auto-sync min → max until max is manually changed
    let maxEdited = false;
    this.searchForm.get('maxAmount')?.valueChanges.subscribe(() => { maxEdited = true; });
    this.searchForm.get('minAmount')?.valueChanges.subscribe((minVal: string | number) => {
      if (!maxEdited) {
        this.searchForm.get('maxAmount')?.setValue(minVal, { emitEvent: false });
      }
    });
  }

  onSearch() {
    this.searched = true;
    this.loading = true;

    const formValue = this.searchForm.value;
    const payload: TransactionSearchDto = {
      startDate: formValue.startDate || null,
      endDate: formValue.endDate || null,
      minAmount: formValue.minAmount !== '' ? Number(formValue.minAmount) : null,
      maxAmount: formValue.maxAmount !== '' ? Number(formValue.maxAmount) : null,
      bankId: formValue.bankId || null,
      brandId: formValue.brandId || null,
      locationId: formValue.locationId || null,
      typeId: formValue.typeId || null,
      keyword: formValue.keyword?.trim() || null
    };

    this.transactionService.searchTransactions(payload).subscribe({
      next: (data) => {
        this.results = data.map(tx => {
          const bank = this.banks.find(b => b.id === tx.bankId);
          const brand = this.brands.find(b => b.id === tx.brandId);
          const type = this.transactionTypes.find(t => t.id === tx.typeId);
          const locationName = this.locationMap[tx.locationId] || '—';

          return {
            ...tx,
            bankName: bank ? bank.name : tx.bankId,
            brandName: brand ? brand.name : tx.brandId,
            typeName: type ? type.name : tx.typeId,
            locationName,
            groupId: tx.groupId
          };
        });
        this.loading = false;
      },
      error: (err) => {
        console.error('Search failed', err);
        this.results = [];
        this.loading = false;
      }
    });
  }

  // Reset button logic
  onReset() {
    const today = new Date();
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const format = (d: Date) => d.toISOString().substring(0, 10);

    this.searchForm.reset({
      startDate: format(firstDayOfMonth),
      endDate: format(today),
      minAmount: '',
      maxAmount: '',
      bankId: '',
      brandId: '',
      locationId: '',
      typeId: '',
      keyword: '',
    });

    this.results = [];
    this.searched = false;
    this.loading = false;
  }

  openTransactionGroup(groupId: string) {
    this.router.navigate(['/transaction-view', groupId]);
  }
}
