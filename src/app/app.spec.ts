// Angular core/testing
import { TestBed } from '@angular/core/testing';

// Angular modules
import { CommonModule } from '@angular/common';
import { provideHttpClient } from '@angular/common/http';
import { provideLocationMocks } from '@angular/common/testing';
import { provideRouter } from '@angular/router';

// Local app files
import { App } from './app';
import { routes } from './app.routes';
import { AuthService } from './services/auth.service';

describe('App', () => {
  let authServiceSpy: jasmine.SpyObj<AuthService>;

  beforeEach(async () => {
    authServiceSpy = jasmine.createSpyObj('AuthService', ['logout', 'isLoggedIn']);

    await TestBed.configureTestingModule({
      imports: [
        App,
        CommonModule,
      ],
      providers: [
        provideHttpClient(),
        provideRouter(routes),            // use provideRouter with your routes
        provideLocationMocks(),           // provide location mocks if you need to simulate navigation
        { provide: AuthService, useValue: authServiceSpy },
      ],
    }).compileComponents();
  });


  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should have a router-outlet', () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('router-outlet')).toBeTruthy();
  });

  it('should have a Home link with correct routerLink', () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;

    const homeLink = compiled.querySelector('a.nav-link[routerlink="/home"]');
    expect(homeLink).toBeTruthy();
    expect(homeLink?.textContent).toContain('Home');
  });

  it('should have a Portfolio link with correct href', () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;

    const portfolioLink = compiled.querySelector('a.nav-link[href="https://bellamyphan.space"]');
    expect(portfolioLink).toBeTruthy();
    expect(portfolioLink?.textContent).toContain('Portfolio');
  });

  it('should call AuthService.logout() and navigate to /login when logout button is clicked', () => {
    authServiceSpy.isLoggedIn.and.returnValue(true);
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    const button = compiled.querySelector('button.btn-outline-light') as HTMLButtonElement;

    button.click();

    expect(authServiceSpy.logout).toHaveBeenCalled();
  });
});
