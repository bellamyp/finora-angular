import { Component, OnInit } from '@angular/core';
import { BankDto } from '../../dto/bank.dto';
import { BankService } from '../../services/bank.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-bank-list',
  imports: [CommonModule],
  templateUrl: './bank-list.html',
  styleUrl: './bank-list.scss',
})
export class BankList implements OnInit {

  banks: BankDto[] = [];
  loading = true;  // <-- track loading state
  error?: string;

  constructor(
    private bankService: BankService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.bankService.getBanks().subscribe({
      next: (data) => {
        this.banks = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Failed to fetch banks:', err);
        this.error = 'Failed to load banks.';
        this.loading = false;
      },
    });
  }

  editBank(bank: BankDto): void {
    window.alert('Edit bank not implemented yet!');
    console.log('Edit bank:', bank);
  }

  viewBank(bank: BankDto): void {
    this.router.navigate(['/bank-view', bank.id]);
  }
}
