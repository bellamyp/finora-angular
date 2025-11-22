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
    this.pingSub = timer(0, 15000)
      .pipe(switchMap(() => this.pingService.ping()))
      .subscribe({
        next: (result) => {
          this.backendStatus = result === 'pong' ? 'up' : 'down';

          // Get current route path (ignores query params)
          const currentRoute = this.router.routerState.snapshot.root.firstChild?.routeConfig?.path;

          // List of routes that don't require login
          const publicRoutes = ['login', 'signup', 'login-otp-request', 'login-otp-confirm'];

          if (!publicRoutes.includes(currentRoute || '') && !this.auth.isLoggedIn()) {
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

  /** Used in template to check login state */
  get isLoggedIn(): boolean {
    return this.auth.isLoggedIn();
  }

  /** Used in template to show current user email */
  get currentUserEmail(): string | null {
    return this.auth.getCurrentUser()?.email ?? null;
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
