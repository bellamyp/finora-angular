import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { Login } from './login';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { provideRouter } from '@angular/router';
import { provideLocationMocks } from '@angular/common/testing';
import { of, throwError } from 'rxjs';
import { By } from '@angular/platform-browser';
import { Component } from '@angular/core';
import { DebugElement } from '@angular/core';
import { FormsModule } from '@angular/forms';

// Dummy component for root route
@Component({ template: '' })
class DummyComponent {}

describe('Login', () => {
  let component: Login;
  let fixture: ComponentFixture<Login>;
  let mockAuthService: jasmine.SpyObj<AuthService>;
  let alertSpy: jasmine.Spy;
  let router: Router;

  beforeEach(async () => {
    mockAuthService = jasmine.createSpyObj('AuthService', ['login', 'isLoggedIn']);
    alertSpy = spyOn(window, 'alert');

    await TestBed.configureTestingModule({
      imports: [
        Login,
        FormsModule,
      ],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        provideRouter([{ path: '', component: DummyComponent }]),
        provideLocationMocks()
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(Login);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    spyOn(router, 'navigate'); // spy on navigation
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should redirect to /home if already logged in', () => {
    mockAuthService.isLoggedIn.and.returnValue(true);
    component.ngOnInit();
    expect(router.navigate).toHaveBeenCalledWith(['/home']);
  });

  it('should navigate on successful login', fakeAsync(() => {
    component.email = 'user@example.com';
    component.password = 'password';
    mockAuthService.login.and.returnValue(of(true));

    component.login();
    tick();

    expect(mockAuthService.login).toHaveBeenCalledWith('user@example.com', 'password');
    expect(router.navigate).toHaveBeenCalledWith(['/home']);
  }));

  it('should show alert if login fails', fakeAsync(() => {
    component.email = 'user@example.com';
    component.password = 'wrongpass';
    mockAuthService.login.and.returnValue(of(false));

    component.login();
    tick();

    expect(mockAuthService.login).toHaveBeenCalledWith('user@example.com', 'wrongpass');
    expect(router.navigate).not.toHaveBeenCalled(); // <-- use router spy
    expect(alertSpy).toHaveBeenCalledWith('❌ Login failed: Invalid email or password.');
  }));

  it('should show alert on network error', fakeAsync(() => {
    component.email = 'user@example.com';
    component.password = 'password';
    mockAuthService.login.and.returnValue(throwError(() => new Error('Network error')));

    component.login();
    tick();

    expect(mockAuthService.login).toHaveBeenCalledWith('user@example.com', 'password');
    expect(alertSpy).toHaveBeenCalledWith('❌ Login failed: Network or server error.');
  }));

  it('should show alert when clicking loginWithGithub', () => {
    component.loginWithGithub();
    expect(alertSpy).toHaveBeenCalledWith('⚠️ This button is not working yet.');
  });

  it('should show alert when clicking loginWithGoogle', () => {
    component.loginWithGoogle();
    expect(alertSpy).toHaveBeenCalledWith('⚠️ This button is not working yet.');
  });

  it('should show alert when clicking loginWithFacebook', () => {
    component.loginWithFacebook();
    expect(alertSpy).toHaveBeenCalledWith('⚠️ This button is not working yet.');
  });

  it('should show alert when clicking loginWithIcloud', () => {
    component.loginWithIcloud();
    expect(alertSpy).toHaveBeenCalledWith('⚠️ This button is not working yet.');
  });

  it('should update component properties from input fields', () => {
    fixture.detectChanges();
    const emailInput = fixture.debugElement.query(By.css('input[name="email"]')).nativeElement;
    const passwordInput = fixture.debugElement.query(By.css('input[name="password"]')).nativeElement;

    emailInput.value = 'newuser@example.com';
    emailInput.dispatchEvent(new Event('input'));
    passwordInput.value = 'newpassword';
    passwordInput.dispatchEvent(new Event('input'));

    expect(component.email).toBe('newuser@example.com');
    expect(component.password).toBe('newpassword');
  });

  it('should have routerLink to /signup', () => {
    const anchorDe: DebugElement = fixture.debugElement.query(By.css('a'));
    expect(anchorDe).toBeTruthy();

    // Instead of injector.get, check href rendered in DOM
    const anchorEl: HTMLAnchorElement = anchorDe.nativeElement;
    expect(anchorEl.getAttribute('href')).toBe('/signup');
  });
});
