import {Component} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {BankCreateDto} from '../../dto/bank-create.dto';
import {BankService} from '../../services/bank.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-bank-create',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './bank-create.html',
  styleUrl: './bank-create.scss',
})
export class BankCreate {

  bankForm: FormGroup;
  bankTypes: BankCreateDto['type'][] = ['CHECKING', 'SAVINGS', 'CREDIT', 'REWARDS'];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private bankService: BankService
  ) {
    // Only the backend-required fields
    this.bankForm = this.fb.group({
      name: ['', Validators.required],
      openingDate: ['', Validators.required],
      closingDate: [''],
      type: ['', Validators.required]
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
      type: raw.type
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
}
