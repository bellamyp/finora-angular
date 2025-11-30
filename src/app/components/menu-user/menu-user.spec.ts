import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MenuUser } from './menu-user';
import { By } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { Component } from '@angular/core';

// Dummy route component
@Component({ template: '' })
class DummyComponent {}

describe('MenuUser', () => {
  let component: MenuUser;
  let fixture: ComponentFixture<MenuUser>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MenuUser],
      providers: [provideRouter([{ path: '', component: DummyComponent }])]
    }).compileComponents();

    fixture = TestBed.createComponent(MenuUser);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have Transactions buttons', () => {
    const grids = fixture.debugElement.queryAll(By.css('.d-grid.gap-2.mb-4'));
    const transactionGrid = grids[0]; // first section

    const buttons = transactionGrid.queryAll(By.css('button'));
    expect(buttons.length).toBe(5);

    const labels = buttons.map(btn => btn.nativeElement.textContent.trim());

    expect(labels).toContain('Add a Transaction');
    expect(labels).toContain('Pending Transactions');
    expect(labels).toContain('Search a Transaction');
    expect(labels).toContain('Posted Transactions');
    expect(labels).toContain('Repeat Transactions');
  });

  it('should have Reports buttons', () => {
    const grids = fixture.debugElement.queryAll(By.css('.d-grid.gap-2.mb-4'));
    const reportGrid = grids[1]; // second section

    const buttons = reportGrid.queryAll(By.css('button'));
    expect(buttons.length).toBe(3);

    const labels = buttons.map(btn => btn.nativeElement.textContent.trim());

    expect(labels).toContain('New Report');
    expect(labels).toContain('View Report');
    expect(labels).toContain('Custom Report');
  });

  it('should have Banks buttons', () => {
    const grids = fixture.debugElement.queryAll(By.css('.d-grid.gap-2.mb-4'));
    const bankGrid = grids[2]; // third section

    const buttons = bankGrid.queryAll(By.css('button'));
    expect(buttons.length).toBe(2);

    const labels = buttons.map(btn => btn.nativeElement.textContent.trim());

    expect(labels).toContain('List Banks');
    expect(labels).toContain('Add a Bank');
  });

  it('should have Records buttons', () => {
    const grids = fixture.debugElement.queryAll(By.css('.d-grid.gap-2.mb-4'));
    const recordGrid = grids[3]; // fourth section

    const buttons = recordGrid.queryAll(By.css('button'));
    expect(buttons.length).toBe(3);

    const labels = buttons.map(btn => btn.nativeElement.textContent.trim());

    expect(labels).toContain('Active Records');
    expect(labels).toContain('Add New Record');
    expect(labels).toContain('Old Records');
  });
});
