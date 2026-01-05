import { Component, OnInit } from '@angular/core';
import { BankDto } from '../../dto/bank.dto';
import { BankService } from '../../services/bank.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import {BankGroupService} from '../../services/bank-group.service';
import {BankGroupDto} from '../../dto/bank-group.dto';

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

  private groupMap: Map<string, string> = new Map(); // groupId -> groupName

  constructor(
    private bankService: BankService,
    private bankGroupService: BankGroupService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Step 1: Fetch all bank groups first
    this.bankGroupService.getBankGroups().subscribe({
      next: (groups: BankGroupDto[]) => {
        // Build a map of groupId -> groupName
        this.groupMap = new Map(groups.map(g => [g.id, g.name]));

        // Step 2: Fetch banks
        this.bankService.getBanks().subscribe({
          next: (banks: BankDto[]) => {
            // Step 3: Replace groupId with group name for display
            this.banks = banks.map(b => ({
              ...b,
              groupId: this.groupMap.get(b.groupId) ?? b.groupId
            }));
            this.loading = false;
          },
          error: (err) => {
            console.error('Failed to fetch banks:', err);
            this.error = 'Failed to load banks.';
            this.loading = false;
          },
        });
      },
      error: (err) => {
        console.error('Failed to fetch bank groups:', err);
        this.error = 'Failed to load bank groups.';
        this.loading = false;
      },
    });
  }

  editBank(bank: BankDto): void {
    // Navigate to the edit page
    this.router.navigate(['/bank-edit', bank.id]);
  }

  viewBank(bank: BankDto): void {
    this.router.navigate(['/bank-view', bank.id]);
  }
}
