import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { CommonModule, NgClass } from '@angular/common';
import { BankService } from '../../services/bank.service';
import { BrandService } from '../../services/brand.service';
import { TransactionTypeEnum } from '../../dto/transaction-type.enum';
import { enumToOptions } from '../../utils/enum-utils';
import { BankDto } from '../../dto/bank.dto';
import { BrandDto } from '../../dto/brand.dto';
import { TransactionTypeOption } from '../../dto/transaction-type.dto';

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

  banks: BankDto[] = [];
  brands: BrandDto[] = [];
  transactionTypes: TransactionTypeOption[] = [];

  constructor(
    private fb: FormBuilder,
    private bankService: BankService,
    private brandService: BrandService
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
      typeId: [''],
      keyword: [''],
    });

    // Load lookup data
    this.loadBanks();
    this.loadBrands();
    this.transactionTypes = enumToOptions(TransactionTypeEnum);
  }

  loadBanks() {
    this.bankService.getBanks().subscribe({
      next: (data) => this.banks = data,
      error: (err) => console.error('[Bank] Load Error:', err),
    });
  }

  loadBrands() {
    this.brandService.getBrandsByUser().subscribe({
      next: (data) => this.brands = data,
      error: (err) => console.error('[Brand] Load Error:', err),
    });
  }

  onSearch() {
    this.searched = true;

    // Mock results for demo (replace with actual API call)
    this.results = [
      { id: 'T1001', date: '2025-02-10', bankName: 'Chase', brandName: 'Walmart', amount: -45.50, notes: 'Groceries' },
      { id: 'T1002', date: '2025-02-09', bankName: 'Discover', brandName: 'Starbucks', amount: 12.75, notes: 'Coffee' },
      { id: 'T1003', date: '2025-02-08', bankName: 'Amex', brandName: 'Amazon', amount: -89.99, notes: 'Online purchase' }
    ];
  }
}
