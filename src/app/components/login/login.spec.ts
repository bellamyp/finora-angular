import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Login } from './login';
import {AuthService} from '../../services/auth.service';
import {Router} from '@angular/router';
import {By} from '@angular/platform-browser';

describe('Login', () => {
  let component: Login;
  let fixture: ComponentFixture<Login>;
  let mockAuthService: jasmine.SpyObj<AuthService>;
  let mockRouter: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    mockAuthService = jasmine.createSpyObj('AuthService', ['login']);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [Login], // standalone component
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: Router, useValue: mockRouter }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(Login);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call AuthService.login and navigate on login()', () => {
    // Arrange
    component.email = 'user@example.com';
    component.password = 'password';
    mockAuthService.login.and.returnValue(true);

    // Act
    component.login();

    // Assert
    expect(mockAuthService.login).toHaveBeenCalledWith('user@example.com', 'password');
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/home']);
  });

  it('should not navigate if login fails', () => {
    component.email = 'user@example.com';
    component.password = 'wrongpass';
    mockAuthService.login.and.returnValue(false);

    component.login();

    expect(mockAuthService.login).toHaveBeenCalledWith('user@example.com', 'wrongpass');
    expect(mockRouter.navigate).not.toHaveBeenCalled();
  });

  it('should login with GitHub and navigate', () => {
    mockAuthService.login.and.returnValue(true);

    component.loginWithGithub();

    expect(mockAuthService.login).toHaveBeenCalledWith('test', 'test');
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/home']);
  });

  it('should update component properties from input fields', () => {
    const emailInput = fixture.debugElement.query(By.css('input[name="email"]')).nativeElement;
    const passwordInput = fixture.debugElement.query(By.css('input[name="password"]')).nativeElement;

    emailInput.value = 'newuser@example.com';
    emailInput.dispatchEvent(new Event('input'));
    passwordInput.value = 'newpassword';
    passwordInput.dispatchEvent(new Event('input'));

    expect(component.email).toBe('newuser@example.com');
    expect(component.password).toBe('newpassword');
  });
});
