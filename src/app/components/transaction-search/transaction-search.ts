import {FormBuilder, FormGroup, ReactiveFormsModule} from '@angular/forms';
import {Component, OnInit} from '@angular/core';
import {CommonModule, NgClass} from '@angular/common';

@Component({
  selector: 'app-transaction-search',
  imports: [ReactiveFormsModule, NgClass, CommonModule],
  templateUrl: './transaction-search.html',
  styleUrl: './transaction-search.scss',
})
export class TransactionSearch implements OnInit {

  searchForm!: FormGroup;
  results: any[] = [];
  searched = false; // <-- controls when the bottom shows

  constructor(
    private fb: FormBuilder
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
  }

  onSearch() {
    this.searched = true; // show results section

    // Mock result list
    this.results = [
      {
        id: 'T1001',
        date: '2025-02-10',
        bankName: 'Chase',
        brandName: 'Walmart',
        amount: -45.50,
        notes: 'Groceries'
      },
      {
        id: 'T1002',
        date: '2025-02-09',
        bankName: 'Discover',
        brandName: 'Starbucks',
        amount: 12.75,
        notes: 'Coffee'
      },
      {
        id: 'T1003',
        date: '2025-02-08',
        bankName: 'Amex',
        brandName: 'Amazon',
        amount: -89.99,
        notes: 'Online purchase'
      }
    ];
  }

}
