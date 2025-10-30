import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PingService } from './services/ping.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnInit{
  title = 'finora-angular';
  backendStatus: 'loading' | 'up' | 'down' = 'loading';

  constructor(private pingService: PingService) {}

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
}
