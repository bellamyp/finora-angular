import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {BankCreateDto} from '../../dto/bank-create.dto';
import {BankService} from '../../services/bank.service';
import {Router} from '@angular/router';
import {BankGroupDto} from '../../dto/bank-group.dto';
import {BankGroupService} from '../../services/bank-group.service';

@Component({
  selector: 'app-bank-create',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './bank-create.html',
  styleUrl: './bank-create.scss',
})
export class BankCreate implements OnInit {

  bankForm: FormGroup;
  bankTypes: BankCreateDto['type'][] = ['CHECKING', 'SAVINGS', 'CREDIT', 'REWARDS'];
  bankGroups: BankGroupDto[] = [];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private bankService: BankService,
    private bankGroupService: BankGroupService
  ) {
    // Only the backend-required fields
    this.bankForm = this.fb.group({
      groupId: ['', Validators.required],
      name: ['', Validators.required],
      openingDate: ['', Validators.required],
      closingDate: [''],
      type: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadBankGroups();
  }

  /** Load bank groups from the backend */
  private loadBankGroups(): void {
    this.bankGroupService.getBankGroups().subscribe({
      next: (groups) => {
        this.bankGroups = groups;
      },
      error: (err) => {
        console.error('Failed to load bank groups:', err);
        alert('Error loading bank groups.');
      }
    });
  }

  submit() {
    if (this.bankForm.invalid) {
      this.bankForm.markAllAsTouched();
      return;
    }

    // Prepare payload matching backend BankCreateDto
    const raw = this.bankForm.getRawValue();
    const payload: BankCreateDto = {
      name: raw.name,
      openingDate: raw.openingDate,
      closingDate: raw.closingDate || null,
      type: raw.type,
      groupId: raw.groupId
    };

    this.bankService.createBank(payload).subscribe({
      next: () => {
        alert('Bank created successfully!');
        this.router.navigate(['/bank-list']);

      },
      error: (err) => {
        alert('Error creating bank: ' + err.message);
      }
    });
  }

  addBankGroup() {
    this.router.navigate(['/bank-group-create']);
  }
}
