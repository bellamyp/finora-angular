import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SignUp } from './sign-up';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { of } from 'rxjs';

describe('SignUp', () => {
  let component: SignUp;
  let fixture: ComponentFixture<SignUp>;
  let mockRouter: any;

  beforeEach(async () => {
    // Complete Router mock for RouterLink
    mockRouter = {
      navigate: jasmine.createSpy('navigate'),
      createUrlTree: jasmine.createSpy('createUrlTree').and.returnValue({}),
      serializeUrl: jasmine.createSpy('serializeUrl').and.returnValue(''),
      events: of(new NavigationEnd(1, '/signup', '/signup')), // Observable for RouterLink subscription
    };

    await TestBed.configureTestingModule({
      imports: [SignUp, FormsModule],
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: {} }, // dummy ActivatedRoute
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

  it('should have Phone Number input', () => {
    const input = fixture.debugElement.query(By.css('input[placeholder="Phone Number"]'));
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
});
