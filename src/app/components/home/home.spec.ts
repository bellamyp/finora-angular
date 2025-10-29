import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Home } from './home';
import {UserService} from '../../services/user.service';
import {UserDTO} from '../../dto/user.dto';
import {CommonModule} from '@angular/common';
import {of, throwError} from 'rxjs';
import {By} from '@angular/platform-browser';

describe('Home', () => {
  let component: Home;
  let fixture: ComponentFixture<Home>;
  let mockUserService: jasmine.SpyObj<UserService>;

  const dummyUsers: UserDTO[] = [
    { id: 1, username: 'alice', email: 'alice@example.com' },
    { id: 2, username: 'bob', email: 'bob@example.com' },
  ];

  beforeEach(async () => {
    // Create a mock UserService
    mockUserService = jasmine.createSpyObj('UserService', ['getAllUsers']);

    await TestBed.configureTestingModule({
      imports: [Home],
      providers: [
        { provide: UserService, useValue: mockUserService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(Home);
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
    expect(rows[0].nativeElement.textContent).toContain('alice');
    expect(rows[0].nativeElement.textContent).toContain('alice@example.com');
    expect(rows[1].nativeElement.textContent).toContain('bob');
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
