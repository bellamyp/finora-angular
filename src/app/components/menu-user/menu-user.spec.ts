import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MenuUser } from './menu-user';
import { By } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { Component } from '@angular/core';

// Dummy root route component
@Component({ template: '' })
class DummyComponent {}

describe('MenuUser', () => {
  let component: MenuUser;
  let fixture: ComponentFixture<MenuUser>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        MenuUser,
      ],
      providers: [
        provideRouter([{ path: '', component: DummyComponent }])
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(MenuUser);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have Transactions buttons', () => {
    const transactionButtons = fixture.debugElement.queryAll(By.css('.d-grid.mb-4 button'));
    expect(transactionButtons.length).toBe(4);

    const labels = transactionButtons.map(btn => btn.nativeElement.textContent.trim());
    expect(labels).toContain('Add a Transaction');
    expect(labels).toContain('Recent Transactions');
    expect(labels).toContain('Pending Transactions');
    expect(labels).toContain('Search a Transaction');
  });

  it('should have Banks buttons', () => {
    const allGrids = fixture.debugElement.queryAll(By.css('.d-grid.gap-2'));
    const bankGrid = allGrids[1]; // second grid
    const bankButtons = bankGrid.queryAll(By.css('button, a')); // include <a>

    expect(bankButtons.length).toBe(3);

    const labels = bankButtons.map(btn => btn.nativeElement.textContent.trim());
    expect(labels).toContain('List Banks');
    expect(labels).toContain('Add a Bank');
    expect(labels).toContain('Edit a Bank');
  });
});
