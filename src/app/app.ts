import { Component, OnInit } from '@angular/core';
import {Router, RouterLink, RouterLinkActive, RouterOutlet} from '@angular/router';
import { PingService } from './services/ping.service';
import { CommonModule } from '@angular/common';
import {AuthService} from './services/auth.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnInit{
  title = 'finora-angular';
  backendStatus: 'loading' | 'up' | 'down' = 'loading';

  constructor(
    private pingService: PingService,
    private auth: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.checkBackend();
    // optional: keep checking every 15 seconds
    setInterval(() => this.checkBackend(), 15000);
  }

  checkBackend() {
    this.backendStatus = 'loading';
    this.pingService.ping().subscribe(result => {
      this.backendStatus = result === 'pong' ? 'up' : 'down';
    });
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
