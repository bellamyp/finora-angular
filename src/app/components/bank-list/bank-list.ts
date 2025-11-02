import {Component, OnInit} from '@angular/core';
import {BankDto} from '../../dto/bank.dto';
import {BankService} from '../../services/bank.service';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-bank-list',
  imports: [ CommonModule ],
  templateUrl: './bank-list.html',
  styleUrl: './bank-list.scss',
})
export class BankList implements OnInit {

  banks: BankDto[] = [];
  userEmail: string | null = null;

  constructor(private bankService: BankService) {}

  ngOnInit(): void {
    const userJson = localStorage.getItem('user');
    if (userJson) {
      try {
        const user = JSON.parse(userJson);
        this.userEmail = user.email;
      } catch {
        console.error('Invalid user data in localStorage');
      }
    }

    if (this.userEmail) {
      this.bankService.getBanksByUserEmail(this.userEmail).subscribe({
        next: (data) => (this.banks = data),
        error: (err) => console.error('Failed to fetch banks:', err),
      });
    }
  }
}
