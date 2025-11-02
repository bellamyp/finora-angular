import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SignUp } from './sign-up';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { UserService } from '../../services/user.service';

describe('SignUp', () => {
  let component: SignUp;
  let fixture: ComponentFixture<SignUp>;
  let mockRouter: any;
  let mockUserService: any;

  beforeEach(async () => {
    mockRouter = {
      navigate: jasmine.createSpy('navigate'),
      createUrlTree: jasmine.createSpy('createUrlTree').and.returnValue({}),
      serializeUrl: jasmine.createSpy('serializeUrl').and.returnValue(''),
      events: of(new NavigationEnd(1, '/signup', '/signup')),
    };

    mockUserService = {
      createUser: jasmine.createSpy('createUser').and.returnValue(of('User created successfully')),
    };

    await TestBed.configureTestingModule({
      imports: [
        SignUp,
        FormsModule,
        ReactiveFormsModule
      ],
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: { snapshot: {}, params: of({}) } },
        { provide: UserService, useValue: mockUserService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(SignUp);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have Full Name input', () => {
    const input = fixture.debugElement.query(By.css('input[placeholder="Full Name"]'));
    expect(input).toBeTruthy();
  });

  it('should have Email input', () => {
    const input = fixture.debugElement.query(By.css('input[placeholder="Email"]'));
    expect(input).toBeTruthy();
  });

  it('should have Password input', () => {
    const input = fixture.debugElement.query(By.css('input[placeholder="Password"]'));
    expect(input).toBeTruthy();
  });

  it('should have a Sign Up button', () => {
    const button = fixture.debugElement.query(By.css('button[type="submit"]'));
    expect(button).toBeTruthy();
    expect(button.nativeElement.textContent).toContain('Sign Up');
  });

  it('should have a Sign in router link', () => {
    const link = fixture.debugElement.query(By.css('a'));
    expect(link).toBeTruthy();
    expect(link.nativeElement.textContent).toContain('Sign in');
  });

  it('should alert user if form is invalid', () => {
    spyOn(window, 'alert');

    component.signUpForm.setValue({
      name: '',
      email: 'wrong',
      password: ''
    });

    component.onSubmit();

    expect(window.alert).toHaveBeenCalledWith(
      jasmine.stringMatching(/Sign-up failed/)
    );
  });

  it('should call UserService.createUser and navigate on valid form submit', () => {
    spyOn(window, 'alert'); // suppress alert

    component.signUpForm.setValue({
      name: 'John Doe',
      email: 'john@example.com',
      password: '123456'
    });

    component.onSubmit();

    expect(mockUserService.createUser).toHaveBeenCalledWith({
      name: 'John Doe',
      email: 'john@example.com',
      password: '123456'
    });

    expect(mockRouter.navigate).toHaveBeenCalledWith(['/login']);
  });
});
