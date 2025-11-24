import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule} from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-transaction-search',
  imports: [ReactiveFormsModule],
  templateUrl: './transaction-search.html',
  styleUrl: './transaction-search.scss',
})
export class TransactionSearch implements OnInit {

  searchForm!: FormGroup;
  results: any[] = [];

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
  ) {}

  ngOnInit(): void {
    const today = new Date();
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    // format to YYYY-MM-DD for input[type="date"]
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
    const criteria = this.searchForm.value;

    this.http.post<any[]>('/api/transactions/search', criteria)
      .subscribe(res => {
        this.results = res;
      });
  }
}
