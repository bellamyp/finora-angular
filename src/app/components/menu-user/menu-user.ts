import { Component } from '@angular/core';
import { RouterLinkWithHref } from '@angular/router';

@Component({
  selector: 'app-menu-user',
  imports: [
    RouterLinkWithHref,
  ],
  templateUrl: './menu-user.html',
  styleUrl: './menu-user.scss',
})
export class MenuUser {

  // Reports
  newReport() {
    alert('New Report is not implemented yet.');
  }

  viewReport() {
    alert('View Report is not implemented yet.');
  }

  customReport() {
    alert('Custom Report is not implemented yet.');
  }

  // Records
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
