import { Component, OnInit } from '@angular/core';
import { UserDTO } from '../../dto/user.dto';
import { UserService } from '../../services/user.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  imports: [CommonModule],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home implements OnInit {

  users: UserDTO[] = [];

  constructor(private userService: UserService) { }

  ngOnInit(): void {
    this.userService.getAllUsers().subscribe({
      next: data => {
        // Map role object if backend includes it
        this.users = data.map(user => ({
          id: user.id,
          name: user.name,
          email: user.email,
        }));
      },
      error: err => console.error('Error fetching users', err)
    });
  }
}
