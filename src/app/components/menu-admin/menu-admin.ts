import { Component, OnInit } from '@angular/core';
import { UserDTO } from '../../dto/user.dto';
import { UserService } from '../../services/user.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-menu-admin',
  imports: [CommonModule],
  templateUrl: './menu-admin.html',
  styleUrl: './menu-admin.scss',
})
export class MenuAdmin implements OnInit {

  users: UserDTO[] = [];// store logged-in user's role

  constructor(
    private userService: UserService
  ) { }

  ngOnInit(): void {
    // Optional: still fetch all users for the table
    this.userService.getAllUsers().subscribe({
      next: data => {
        this.users = data;
      },
      error: err => console.error('Error fetching users', err)
    });
  }
}
