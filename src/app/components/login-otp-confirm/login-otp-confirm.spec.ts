import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginOtpConfirm } from './login-otp-confirm';

describe('LoginOtpConfirm', () => {
  let component: LoginOtpConfirm;
  let fixture: ComponentFixture<LoginOtpConfirm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginOtpConfirm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoginOtpConfirm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
