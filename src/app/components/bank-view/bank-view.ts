import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BankService } from '../../services/bank.service';
import { BankDto } from '../../dto/bank.dto';
import { CommonModule } from '@angular/common';
import {BankDailyBalanceDto} from '../../dto/bank-daily-balance.dto';

@Component({
  selector: 'app-bank-view',
  imports: [CommonModule],
  templateUrl: './bank-view.html',
  styleUrl: './bank-view.scss',
})
export class BankView implements OnInit {

  bank?: BankDto;
  dailyBalances: BankDailyBalanceDto[] = [];
  loading = true;
  error?: string;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private bankService: BankService
  ) {}

  ngOnInit(): void {
    const bankId = this.route.snapshot.paramMap.get('bankId');
    if (bankId) {
      this.bankService.getBankById(bankId).subscribe({
        next: (data) => {
          this.bank = data;

          // Fetch daily balances
          this.bankService.getDailyBalance(bankId).subscribe({
            next: (balances) => {
              this.dailyBalances = balances;
            },
            error: (err) => {
              console.error('Failed to load daily balances:', err);
            }
          });

          this.loading = false;
        },
        error: (err) => {
          console.error('Failed to load bank:', err);
          this.error = 'Failed to load bank details.';
          this.loading = false;
        }
      });
    } else {
      this.error = 'Bank ID not found in route.';
      this.loading = false;
    }
  }

  goToMainMenu(): void {
    this.router.navigate(['/menu-user']); // or /menu-admin depending on your app
  }

  goToBankList(): void {
    this.router.navigate(['/bank-list']);
  }

  editBank(): void {
    window.alert('Edit bank not implemented yet!');
  }
}
