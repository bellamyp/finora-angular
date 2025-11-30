import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { MenuUser } from './menu-user';
import { By } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, throwError } from 'rxjs';
import { ReportService } from '../../services/report.service';
import { ReportDto } from '../../dto/report.dto';
import { Component } from '@angular/core';

// Dummy route component
@Component({ template: '' })
class DummyComponent {}

describe('MenuUser', () => {
  let component: MenuUser;
  let fixture: ComponentFixture<MenuUser>;
  let reportServiceSpy: jasmine.SpyObj<ReportService>;
  let router: Router;

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('ReportService', ['createNewReport']);

    await TestBed.configureTestingModule({
      imports: [
        MenuUser, // standalone
        DummyComponent, // standalone
        RouterTestingModule.withRoutes([{ path: 'report-view/:id', component: DummyComponent }])
      ],
      providers: [{ provide: ReportService, useValue: spy }]
    }).compileComponents();

    fixture = TestBed.createComponent(MenuUser);
    component = fixture.componentInstance;
    reportServiceSpy = TestBed.inject(ReportService) as jasmine.SpyObj<ReportService>;
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have Transactions buttons', () => {
    const grids = fixture.debugElement.queryAll(By.css('.d-grid.gap-2.mb-4'));
    const transactionGrid = grids[0];
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
    const reportGrid = grids[1];
    const buttons = reportGrid.queryAll(By.css('button'));
    expect(buttons.length).toBe(3);
    const labels = buttons.map(btn => btn.nativeElement.textContent.trim());
    expect(labels).toContain('New Report');
    expect(labels).toContain('View Report');
    expect(labels).toContain('Custom Report');
  });

  it('newReport() should call ReportService and navigate on success', fakeAsync(() => {
    const mockReport: ReportDto = { id: 'r1', userId: 'u1', month: '2025-11-01', posted: false };
    reportServiceSpy.createNewReport.and.returnValue(of(mockReport));
    const navigateSpy = spyOn(router, 'navigate');

    component.newReport();
    tick();

    expect(reportServiceSpy.createNewReport).toHaveBeenCalled();
    expect(navigateSpy).toHaveBeenCalledWith(['/report-view', 'r1']);
  }));

  it('newReport() should handle error', fakeAsync(() => {
    const consoleSpy = spyOn(console, 'error');
    reportServiceSpy.createNewReport.and.returnValue(throwError(() => new Error('Failed')));
    spyOn(window, 'alert');

    component.newReport();
    tick();

    expect(reportServiceSpy.createNewReport).toHaveBeenCalled();
    expect(consoleSpy).toHaveBeenCalled();
  }));
});
