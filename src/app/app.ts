import {Component, OnDestroy, OnInit} from '@angular/core';
import {Router, RouterLink, RouterLinkActive, RouterOutlet} from '@angular/router';
import { PingService } from './services/ping.service';
import { CommonModule } from '@angular/common';
import {AuthService} from './services/auth.service';
import {Subscription, switchMap, timer} from 'rxjs';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnInit, OnDestroy {
  backendStatus: 'loading' | 'up' | 'down' = 'loading';
  private pingSub: Subscription | null = null;

  constructor(
    private pingService: PingService,
    private auth: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    // Ping immediately and every 15s
    this.pingSub = timer(0, 15000)
      .pipe(
        switchMap(() => this.pingService.ping())
      )
      .subscribe({
        next: (result) => {
          this.backendStatus = result === 'pong' ? 'up' : 'down';

          // Only enforce token on protected routes
          const publicRoutes = ['/login', '/signup', '/login-otp-request', '/login-otp-confirm'];
          if (!publicRoutes.includes(this.router.url) && !this.auth.isLoggedIn()) {
            alert('⚠️ Your session has expired. Please log in again.');
            this.auth.logout();
            this.router.navigate(['/login']);
          }
        },
        error: () => {
          this.backendStatus = 'down';
        }
      });
  }

  ngOnDestroy() {
    // Clean up subscription to avoid memory leaks
    this.pingSub?.unsubscribe();
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
