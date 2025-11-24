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
    this.searchForm = this.fb.group({
      startDate: [''],
      endDate: [''],
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
