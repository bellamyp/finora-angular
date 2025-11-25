import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ActivatedRoute, RouterLink} from '@angular/router';
import { TransactionGroupService } from '../../services/transaction-group.service';
import { BrandService } from '../../services/brand.service';
import { BankService } from '../../services/bank.service';
import { BrandDto } from '../../dto/brand.dto';
import { BankDto } from '../../dto/bank.dto';
import { TransactionResponseDto } from '../../dto/transaction-group.dto';

@Component({
  selector: 'app-transaction-view',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './transaction-view.html',
  styleUrls: ['./transaction-view.scss']
})
export class TransactionView implements OnInit {

  loading = true;
  groupId?: string;
  transactions: TransactionResponseDto[] = [];

  banks: BankDto[] = [];
  brands: BrandDto[] = [];

  constructor(
    private route: ActivatedRoute,
    private transactionGroupService: TransactionGroupService,
    private bankService: BankService,
    private brandService: BrandService
  ) {}

  ngOnInit(): void {
    this.groupId = this.route.snapshot.paramMap.get('groupId') || '';
    if (this.groupId) {
      this.transactionGroupService.getTransactionGroupById(this.groupId)
        .subscribe({
          next: (group) => {
            this.transactions = group.transactions.map(tx => ({
              ...tx,
              posted: tx.posted ?? false
            }));
            this.loading = false;
          },
          error: (err) => {
            console.error('Failed to fetch transaction group:', err);
            this.loading = false;
          }
        });
    } else {
      console.warn('No groupId provided in route!');
      this.loading = false;
    }

    // Load banks and brands for display
    this.bankService.getBanks().subscribe({
      next: data => this.banks = data,
      error: err => console.error(err)
    });

    this.brandService.getBrandsByUser().subscribe({
      next: data => this.brands = data,
      error: err => console.error(err)
    });
  }

  getBankName(bankId: string) {
    return this.banks.find(b => b.id === bankId)?.name ?? bankId;
  }

  getBrandName(brandId: string) {
    const brand = this.brands.find(b => b.id === brandId);
    return brand ? `${brand.name} (${brand.location})` : brandId;
  }

  markAsRepeat(groupId?: string) {
    window.alert(`Mark group ${groupId} as repeat - not implemented yet`);
  }

  repeatThisGroup(groupId?: string) {
    window.alert(`Repeat group ${groupId} - not implemented yet`);
  }
}
