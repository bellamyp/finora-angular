import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginOtpRequest } from './login-otp-request';

describe('LoginOtpRequest', () => {
  let component: LoginOtpRequest;
  let fixture: ComponentFixture<LoginOtpRequest>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginOtpRequest]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoginOtpRequest);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
