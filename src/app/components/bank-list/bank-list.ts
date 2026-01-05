import { Component, OnInit } from '@angular/core';
import { BankDto } from '../../dto/bank.dto';
import { BankService } from '../../services/bank.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { BankGroupService } from '../../services/bank-group.service';
import { BankGroupDto } from '../../dto/bank-group.dto';

type Mode = 'all' | 'active' | 'inactive';

@Component({
  selector: 'app-bank-list',
  imports: [CommonModule],
  templateUrl: './bank-list.html',
  styleUrls: ['./bank-list.scss'],
})
export class BankList implements OnInit {

  banks: BankDto[] = [];
  loading = true;
  error?: string;

  mode: Mode = 'all';
  private groupMap: Map<string, string> = new Map(); // groupId -> groupName

  constructor(
    private bankService: BankService,
    private bankGroupService: BankGroupService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Load bank groups first
    this.loadBankGroups();
  }

  loadBanks(mode: Mode): void {
    this.mode = mode;
    this.loading = true;
    this.error = undefined;

    let fetch$: any;

    switch (mode) {
      case 'active':
        fetch$ = this.bankService.getActiveBanks();
        break;
      case 'inactive':
        fetch$ = this.bankService.getInactiveBanks();
        break;
      default:
        fetch$ = this.bankService.getBanks();
    }

    fetch$.subscribe({
      next: (banks: BankDto[]) => {
        // Map groupId to group name for display
        this.banks = banks.map(b => ({
          ...b,
          groupId: this.groupMap.get(b.groupId) ?? b.groupId
        }));
        this.loading = false;
      },
      error: (err: any) => {
        console.error('Failed to fetch banks:', err);
        this.error = 'Failed to load banks.';
        this.loading = false;
      }
    });
  }

  editBank(bank: BankDto): void {
    this.router.navigate(['/bank-edit', bank.id]);
  }

  viewBank(bank: BankDto): void {
    this.router.navigate(['/bank-view', bank.id]);
  }

  private loadBankGroups(): void {
    this.bankGroupService.getBankGroups().subscribe({
      next: (groups: BankGroupDto[]) => {
        this.groupMap = new Map(groups.map(g => [g.id, g.name]));
        // Fetch initial banks (default mode: all)
        this.loadBanks(this.mode);
      },
      error: (err) => {
        console.error('Failed to fetch bank groups:', err);
        this.error = 'Failed to load bank groups.';
        this.loading = false;
      }
    });
  }
}
