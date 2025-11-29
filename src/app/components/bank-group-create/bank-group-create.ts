import { Component } from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {debounceTime} from 'rxjs';
import {BankGroupCreateDto} from '../../dto/bank-group-create.dto';
import {BankGroupDto} from '../../dto/bank-group.dto';
import {BankGroupService} from '../../services/bank-group.service';

@Component({
  selector: 'app-bank-group-create',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './bank-group-create.html',
  styleUrl: './bank-group-create.scss',
})
export class BankGroupCreate {

  groupForm: FormGroup;
  isSubmitting = false;
  eligibilityStatus: string | null = null;
  existingGroups: BankGroupDto[] = [];
  isNameTaken = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private bankGroupService: BankGroupService
  ) {
    this.groupForm = this.fb.group({
      name: ['', Validators.required],
    });

    this.loadExistingGroups();

    // Automatically check eligibility when a name changes, with debouncing
    this.groupForm.get('name')?.valueChanges
      .pipe(debounceTime(500)) // wait 0.5s after typing stops
      .subscribe(() => this.checkEligibility());
  }

  private loadExistingGroups() {
    this.bankGroupService.getBankGroups().subscribe({
      next: (groups) => this.existingGroups = groups,
      error: (err) => console.error('Failed to load bank groups:', err)
    });
  }

  checkEligibility() {
    const name = this.groupForm.value.name?.trim();

    if (!name) {
      this.eligibilityStatus = null; // clear message if empty
      this.isNameTaken = true;
      return;
    }

    const nameExists = this.existingGroups.some(
      group => group.name.toLowerCase() === name.toLowerCase()
    );

    this.isNameTaken = nameExists;
    this.eligibilityStatus = nameExists
      ? `❌ The group name "${name}" is already taken.`
      : `✅ The group name "${name}" is available!`;
  }

  submit() {
    if (this.groupForm.invalid || this.isNameTaken) {
      this.groupForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;

    const payload: BankGroupCreateDto = {
      name: this.groupForm.value.name,
    };

    this.bankGroupService.createBankGroup(payload).subscribe({
      next: (createdGroup) => {
        alert(`Bank Group "${createdGroup.name}" created successfully!`);
        this.router.navigate(['/bank-create']);
      },
      error: (err) => {
        console.error('Error creating bank group:', err);
        alert('Failed to create bank group.');
        this.isSubmitting = false;
      }
    });
  }

  goToBankCreate() {
    this.router.navigate(['/bank-create']);
  }
}
