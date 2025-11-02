import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { Login } from './login';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { provideRouter } from '@angular/router';
import { provideLocationMocks } from '@angular/common/testing';
import { of, throwError } from 'rxjs';
import { By } from '@angular/platform-browser';
import { Component, DebugElement } from '@angular/core';
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
    mockAuthService = jasmine.createSpyObj('AuthService', ['login', 'isLoggedIn', 'getCurrentUserRole']);
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

  it('should redirect to menu-admin if already logged in as admin', () => {
    mockAuthService.isLoggedIn.and.returnValue(true);
    mockAuthService.getCurrentUserRole.and.returnValue('ROLE_ADMIN');
    component.ngOnInit();
    expect(router.navigate).toHaveBeenCalledWith(['/menu-admin']);
  });

  it('should redirect to menu-user if already logged in as normal user', () => {
    mockAuthService.isLoggedIn.and.returnValue(true);
    mockAuthService.getCurrentUserRole.and.returnValue('ROLE_USER');
    component.ngOnInit();
    expect(router.navigate).toHaveBeenCalledWith(['/menu-user']);
  });

  it('should navigate to menu-admin on successful admin login', fakeAsync(() => {
    component.email = 'admin@example.com';
    component.password = 'password';
    mockAuthService.login.and.returnValue(of(true));
    mockAuthService.getCurrentUserRole.and.returnValue('ROLE_ADMIN');

    component.login();
    tick();

    expect(mockAuthService.login).toHaveBeenCalledWith('admin@example.com', 'password');
    expect(router.navigate).toHaveBeenCalledWith(['/menu-admin']);
  }));

  it('should navigate to menu-user on successful normal user login', fakeAsync(() => {
    component.email = 'user@example.com';
    component.password = 'password';
    mockAuthService.login.and.returnValue(of(true));
    mockAuthService.getCurrentUserRole.and.returnValue('ROLE_USER');

    component.login();
    tick();

    expect(mockAuthService.login).toHaveBeenCalledWith('user@example.com', 'password');
    expect(router.navigate).toHaveBeenCalledWith(['/menu-user']);
  }));

  it('should show alert if login fails', fakeAsync(() => {
    component.email = 'user@example.com';
    component.password = 'wrongpass';
    mockAuthService.login.and.returnValue(of(false));

    component.login();
    tick();

    expect(mockAuthService.login).toHaveBeenCalledWith('user@example.com', 'wrongpass');
    expect(router.navigate).not.toHaveBeenCalled();
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

    const anchorEl: HTMLAnchorElement = anchorDe.nativeElement;
    expect(anchorEl.getAttribute('href')).toBe('/signup');
  });
});
