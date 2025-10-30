import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Login } from './login';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { By } from '@angular/platform-browser';

describe('Login', () => {
  let component: Login;
  let fixture: ComponentFixture<Login>;
  let mockAuthService: jasmine.SpyObj<AuthService>;
  let mockRouter: jasmine.SpyObj<Router>;
  let alertSpy: jasmine.Spy;

  beforeEach(async () => {
    mockAuthService = jasmine.createSpyObj('AuthService', ['login', 'isLoggedIn']);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);
    alertSpy = spyOn(window, 'alert');

    await TestBed.configureTestingModule({
      imports: [Login],
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

  it('should redirect to /home if already logged in', () => {
    mockAuthService.isLoggedIn.and.returnValue(true);
    component.ngOnInit();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/home']);
  });

  it('should call AuthService.login and navigate on login() success', () => {
    component.email = 'user@example.com';
    component.password = 'password';
    mockAuthService.login.and.returnValue(true);

    component.login();

    expect(mockAuthService.login).toHaveBeenCalledWith('user@example.com', 'password');
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/home']);
    expect(alertSpy).not.toHaveBeenCalled(); // no alert on success
  });

  it('should show alert if login fails', () => {
    component.email = 'user@example.com';
    component.password = 'wrongpass';
    mockAuthService.login.and.returnValue(false);

    component.login();

    expect(mockAuthService.login).toHaveBeenCalledWith('user@example.com', 'wrongpass');
    expect(mockRouter.navigate).not.toHaveBeenCalled();
    expect(alertSpy).toHaveBeenCalledWith('❌ Login failed: Invalid email or password.');
  });

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

  it('should navigate to signup on signUpNewAccount()', () => {
    component.signUpNewAccount();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/signup']);
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
});
