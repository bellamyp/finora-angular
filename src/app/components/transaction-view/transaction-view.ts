import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ActivatedRoute, RouterLink} from '@angular/router';
import { TransactionGroupService } from '../../services/transaction-group.service';
import { BrandService } from '../../services/brand.service';
import { BankService } from '../../services/bank.service';
import { BrandDto } from '../../dto/brand.dto';
import { BankDto } from '../../dto/bank.dto';
import { TransactionResponseDto } from '../../dto/transaction-group.dto';
import {TransactionGroupRepeatService} from '../../services/transaction-group-repeat.service';

@Component({
  selector: 'app-transaction-view',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './transaction-view.html',
  styleUrls: ['./transaction-view.scss']
})
export class TransactionView implements OnInit {

  loading = true;
  isRepeat = false;
  groupId?: string;
  transactions: TransactionResponseDto[] = [];

  banks: BankDto[] = [];
  brands: BrandDto[] = [];

  constructor(
    private route: ActivatedRoute,
    private transactionGroupService: TransactionGroupService,
    private transactionGroupRepeatService: TransactionGroupRepeatService,
    private bankService: BankService,
    private brandService: BrandService
  ) {}

  ngOnInit(): void {
    this.groupId = this.route.snapshot.paramMap.get('groupId') || '';
    if (this.groupId) {
      // Load transaction group from BE
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
      // Check if a group is already marked as repeat
      this.transactionGroupRepeatService.isRepeat(this.groupId).subscribe({
        next: (exists) => {
          this.isRepeat = exists;
        },
        error: (err) => {
          console.error('Failed to check repeat status:', err);
          this.isRepeat = false; // fallback
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
    if (!groupId) {
      window.alert('Invalid group ID');
      return;
    }

    // Show loading and clear current transactions
    this.loading = true;
    this.transactions = [];

    this.transactionGroupRepeatService.markAsRepeat(groupId).subscribe({
      next: () => {
        // After marking as repeat, reload the group
        this.transactionGroupService.getTransactionGroupById(groupId).subscribe({
          next: (group) => {
            this.transactions = group.transactions.map(tx => ({
              ...tx,
              posted: tx.posted ?? false
            }));
            this.isRepeat = true;  // mark as repeat in UI
            this.loading = false;
          },
          error: (err) => {
            console.error('Failed to reload transaction group:', err);
            this.loading = false;
          }
        });
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
        if (err.status === 403) {
          window.alert('You are not allowed to mark this group as repeat.');
        } else {
          window.alert('Failed to mark group as repeat. Please try again.');
        }
      }
    });
  }


  repeatThisGroup(groupId?: string) {
    window.alert(`Repeat group ${groupId} - not implemented yet`);
  }
}
