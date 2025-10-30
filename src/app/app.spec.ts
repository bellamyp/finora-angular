import { TestBed } from '@angular/core/testing';
import { App } from './app';
import {CommonModule} from '@angular/common';
import {provideHttpClient} from '@angular/common/http';
import {Router} from '@angular/router';
import {AuthService} from './services/auth.service';

describe('App', () => {
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    authServiceSpy = jasmine.createSpyObj('AuthService', ['logout', 'isLoggedIn']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [App, CommonModule],
      providers: [
        provideHttpClient(),
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy },
      ],
    }).compileComponents();
  });


  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should render title in the template', () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;

    // Check if any h1 contains the component title
    const titleH1 = Array.from(compiled.querySelectorAll('h1'))
      .find(el => el.textContent?.includes(fixture.componentInstance.title));

    expect(titleH1).toBeTruthy();
  });

  it('should have a router-outlet', () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('router-outlet')).toBeTruthy();
  });

  it('should call AuthService.logout() and navigate to /login when logout button is clicked', () => {
    // Arrange
    authServiceSpy.isLoggedIn.and.returnValue(true);
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    const button = compiled.querySelector('button.btn-outline-light') as HTMLButtonElement;

    // Act
    button.click();

    // Assert
    expect(authServiceSpy.logout).toHaveBeenCalled();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/login']);
  });
});
