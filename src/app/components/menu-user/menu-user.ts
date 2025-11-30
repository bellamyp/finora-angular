import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-menu-user',
  templateUrl: './menu-user.html',
  styleUrl: './menu-user.scss',
})
export class MenuUser {

  constructor(private router: Router) {}

  // --- Navigation Methods (Transactions) ---
  goToTransactionUpdate() {
    this.router.navigate(['/transaction-update']);
  }

  goToTransactionPendingList() {
    this.router.navigate(['/transaction-pending-list']);
  }

  goToTransactionSearch() {
    this.router.navigate(['/transaction-search']);
  }

  goToTransactionList() {
    this.router.navigate(['/transaction-list']);
  }

  goToTransactionRepeatList() {
    this.router.navigate(['/transaction-repeat-list']);
  }

  // --- Navigation Methods (Banks) ---
  goToBankList() {
    this.router.navigate(['/bank-list']);
  }

  goToBankCreate() {
    this.router.navigate(['/bank-create']);
  }

  // --- Reports ---
  newReport() {
    alert('New Report is not implemented yet.');
  }

  viewReport() {
    alert('View Report is not implemented yet.');
  }

  customReport() {
    alert('Custom Report is not implemented yet.');
  }

  // --- Records ---
  activeRecords() {
    alert('Active Records is not implemented yet.');
  }

  addRecord() {
    alert('Add New Record is not implemented yet.');
  }

  oldRecords() {
    alert('Old Records is not implemented yet.');
  }
}
