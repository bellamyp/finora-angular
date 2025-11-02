import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuUser } from './menu-user';

describe('MenuUser', () => {
  let component: MenuUser;
  let fixture: ComponentFixture<MenuUser>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MenuUser]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MenuUser);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
