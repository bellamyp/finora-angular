import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {BankCreateDto} from '../../dto/bank-create.dto';
import {BankService} from '../../services/bank.service';
import {Router} from '@angular/router';
import {AuthService} from '../../services/auth.service';

@Component({
  selector: 'app-bank-create',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './bank-create.html',
  styleUrl: './bank-create.scss',
})
export class BankCreate implements OnInit {

  bankForm: FormGroup;
  bankTypes: BankCreateDto['type'][] = ['CHECKING', 'SAVINGS', 'CREDIT', 'REWARDS'];

  constructor(
    private fb: FormBuilder,
    private bankService: BankService,
    private authService: AuthService,
    private router: Router
  ) {
    this.bankForm = this.fb.group({
      name: ['', Validators.required],
      openingDate: ['', Validators.required],
      closingDate: [''],
      type: ['', Validators.required],
      userEmail: ['', [Validators.required, Validators.email]],
    });
  }

  ngOnInit(): void {
    const currentUser = this.authService.getCurrentUser();
    const userEmail = currentUser?.email ?? '';

    this.bankForm = this.fb.group({
      name: ['', Validators.required],
      openingDate: ['', Validators.required],
      closingDate: [''],
      type: ['', Validators.required],
      userEmail: [{ value: userEmail, disabled: true }, [Validators.required, Validators.email]]
    });
  }

  submit() {
    if (this.bankForm.invalid) {
      this.bankForm.markAllAsTouched();
      return;
    }

    // get raw value because userEmail is disabled
    const formValue = this.bankForm.getRawValue() as BankCreateDto;

    this.bankService.createBank(formValue).subscribe({
      next: (res) => {
        alert('Bank created successfully!');
        this.bankForm.reset();
      },
      error: (err) => {
        alert('Error creating bank: ' + err.message);
      }
    });
  }
}
