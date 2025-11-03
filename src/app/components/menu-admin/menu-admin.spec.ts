import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MenuAdmin } from './menu-admin';
import { UserService } from '../../services/user.service';
import { UserDTO } from '../../dto/user.dto';
import { of, throwError } from 'rxjs';
import { By } from '@angular/platform-browser';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('MenuAdmin', () => {
  let component: MenuAdmin;
  let fixture: ComponentFixture<MenuAdmin>;
  let mockUserService: jasmine.SpyObj<UserService>;

  const dummyUsers: UserDTO[] = [
    { id: '550e8400-e29b-41d4-a716-446655440007', name: 'Alice Smith', email: 'alice@example.com', role: 'ROLE_ADMIN' },
    { id: '550e8400-e29b-41d4-a716-446655440008', name: 'Bob Johnson', email: 'bob@example.com', role: 'ROLE_USER' },
  ];

  beforeEach(async () => {
    mockUserService = jasmine.createSpyObj('UserService', ['getAllUsers']);

    await TestBed.configureTestingModule({
      imports: [MenuAdmin, HttpClientTestingModule],
      providers: [
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

  it('should display users in the table', () => {
    mockUserService.getAllUsers.and.returnValue(of(dummyUsers));

    component.ngOnInit();
    fixture.detectChanges();

    const rows = fixture.debugElement.queryAll(By.css('tbody tr'));
    expect(rows.length).toBe(2);
    expect(rows[0].nativeElement.textContent).toContain('Alice Smith');
    expect(rows[0].nativeElement.textContent).toContain('alice@example.com');
    expect(rows[1].nativeElement.textContent).toContain('Bob Johnson');
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
