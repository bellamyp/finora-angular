import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, NgForm} from '@angular/forms';
import {TransactionTypeEnum} from '../../dto/transaction-type.enum';
import {TransactionService} from '../../services/transaction-service';
import {TransactionCreateDto} from '../../dto/transaction-create.dto';
import {TransactionDto} from '../../dto/transaction.dto';
import {AuthService} from '../../services/auth.service';
import {BankService} from '../../services/bank.service';

interface BankOption {
  id: number;
  name: string;
}

@Component({
  selector: 'app-transaction-create',
  imports: [CommonModule, FormsModule], // required modules for template-driven form
  templateUrl: './transaction-create.html',
  styleUrl: './transaction-create.scss',
})
export class TransactionCreate implements OnInit {

  // Form fields
  date!: string;
  amount!: number;
  type: TransactionTypeEnum = TransactionTypeEnum.GROCERY;
  notes?: string;
  bankId?: number;
  userEmail!: string;

  // Enum and banks
  transactionTypes = Object.values(TransactionTypeEnum);
  banks: BankOption[] = [];

  constructor(
    private transactionService: TransactionService,
    private bankService: BankService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    const currentUser = this.authService.getCurrentUser();
    if (currentUser) {
      this.userEmail = currentUser.email;
    } else {
      alert('User not logged in!');
      // Optionally redirect to login
    }

    // Load banks for current user
    this.bankService.getBanksByUserEmail(this.userEmail).subscribe({
      next: (res) => {
        this.banks = res;
      },
      error: (err) => {
        console.error('Error loading banks:', err);
        alert('Failed to load banks');
      }
    });
  }

  submitTransaction(form: NgForm) {
    if (form.invalid) {
      console.log("invalid");
      return;
    }

    const dto: TransactionCreateDto = {
      date: this.date,
      amount: this.amount,
      type: this.type,
      notes: this.notes,
      bankId: this.bankId,
      userEmail: this.userEmail
    };

    this.transactionService.createTransaction(dto).subscribe({
      next: (res: TransactionDto) => {
        console.log('Transaction created:', res);
        alert(`Transaction created! ID: ${res.id}`);
        form.resetForm();
      },
      error: (err) => {
        console.error('Error creating transaction:', err);
        alert(`Error: ${err.error?.message || err.message}`);
      }
    });
  }
}
