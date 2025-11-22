import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MenuAdmin } from './menu-admin';
import { UserService } from '../../services/user.service';
import { UserDTO } from '../../dto/user.dto';
import { of, throwError } from 'rxjs';
import { By } from '@angular/platform-browser';
import {provideHttpClientTesting} from '@angular/common/http/testing';
import { CommonModule } from '@angular/common';

describe('MenuAdmin', () => {
  let component: MenuAdmin;
  let fixture: ComponentFixture<MenuAdmin>;
  let mockUserService: jasmine.SpyObj<UserService>;

  const dummyUsers: UserDTO[] = [
    { name: 'Alice Smith', email: 'alice@example.com', role: 'ROLE_ADMIN' },
    { name: 'Bob Johnson', email: 'bob@example.com', role: 'ROLE_USER' },
  ];

  beforeEach(async () => {
    mockUserService = jasmine.createSpyObj('UserService', ['getAllUsers']);

    await TestBed.configureTestingModule({
      imports: [CommonModule, MenuAdmin],
      providers: [
        provideHttpClientTesting(),
        { provide: UserService, useValue: mockUserService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(MenuAdmin);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch users on ngOnInit', () => {
    mockUserService.getAllUsers.and.returnValue(of(dummyUsers));

    component.ngOnInit();

    expect(mockUserService.getAllUsers).toHaveBeenCalled();
    expect(component.users.length).toBe(2);
    expect(component.users).toEqual(dummyUsers);
  });

  it('should display users in the table including role', () => {
    mockUserService.getAllUsers.and.returnValue(of(dummyUsers));

    component.ngOnInit();
    fixture.detectChanges();

    const rows = fixture.debugElement.queryAll(By.css('tbody tr'));
    expect(rows.length).toBe(2);

    // First row checks
    const firstRowText = rows[0].nativeElement.textContent;
    expect(firstRowText).toContain('Alice Smith');
    expect(firstRowText).toContain('alice@example.com');
    expect(firstRowText).toContain('ROLE_ADMIN');

    // Second row checks
    const secondRowText = rows[1].nativeElement.textContent;
    expect(secondRowText).toContain('Bob Johnson');
    expect(secondRowText).toContain('bob@example.com');
    expect(secondRowText).toContain('ROLE_USER');
  });

  it('should show "No users found" if users array is empty', () => {
    mockUserService.getAllUsers.and.returnValue(of([]));

    component.ngOnInit();
    fixture.detectChanges();

    const noUsersEl = fixture.debugElement.query(By.css('div'));
    expect(noUsersEl.nativeElement.textContent).toContain('No users found');
  });

  it('should log error if getAllUsers fails', () => {
    const consoleSpy = spyOn(console, 'error');
    mockUserService.getAllUsers.and.returnValue(throwError(() => new Error('Network error')));

    component.ngOnInit();

    expect(consoleSpy).toHaveBeenCalledWith('Error fetching users', jasmine.any(Error));
  });
});
