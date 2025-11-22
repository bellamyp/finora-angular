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

  constructor(private bankService: BankService) {}

  ngOnInit(): void {
    this.bankService.getBanks().subscribe({
      next: (data) => this.banks = data,
      error: (err) => console.error('Failed to fetch banks:', err),
    });
  }

  editBank(bank: BankDto): void {
    window.alert('Edit bank not implemented yet!');
    console.log('Edit bank:', bank);
  }

  viewBank(bank: BankDto): void {
    window.alert('View bank details not implemented yet!');
    console.log('View bank details:', bank);
  }
}
