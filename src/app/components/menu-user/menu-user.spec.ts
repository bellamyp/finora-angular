import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { MenuUser } from './menu-user';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { ReportService } from '../../services/report.service';
import { ReportDto } from '../../dto/report.dto';
import { Component } from '@angular/core';
import { provideRouter } from '@angular/router';

// Dummy route component
@Component({ template: '', standalone: true })
class DummyComponent {}

describe('MenuUser', () => {
  let component: MenuUser;
  let fixture: ComponentFixture<MenuUser>;
  let reportServiceSpy: jasmine.SpyObj<ReportService>;
  let router: Router;

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('ReportService', [
      'createNewReport',
      'canGenerateNewReport',
      'hasPendingReport',
      'getNextPendingReport'
    ]);

    await TestBed.configureTestingModule({
      imports: [MenuUser, DummyComponent],
      providers: [
        { provide: ReportService, useValue: spy },
        provideRouter([{ path: 'report-view/:id', component: DummyComponent }])
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(MenuUser);
    component = fixture.componentInstance;
    reportServiceSpy = TestBed.inject(ReportService) as jasmine.SpyObj<ReportService>;
    router = TestBed.inject(Router);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should check report status on init', fakeAsync(() => {
    reportServiceSpy.canGenerateNewReport.and.returnValue(of(true));
    reportServiceSpy.hasPendingReport.and.returnValue(of(true));

    fixture.detectChanges(); // triggers ngOnInit
    tick();

    expect(component.canGenerateReport).toBeTrue();
    expect(component.hasPendingReport).toBeTrue();
    expect(component.loadingReportCheck).toBeFalse();
  }));

  it('should handle checkReportStatus error', fakeAsync(() => {
    reportServiceSpy.canGenerateNewReport.and.returnValue(throwError(() => new Error('Fail')));
    reportServiceSpy.hasPendingReport.and.returnValue(throwError(() => new Error('Fail')));
    const consoleSpy = spyOn(console, 'error');

    fixture.detectChanges();
    tick();

    expect(component.canGenerateReport).toBeFalse();
    expect(component.hasPendingReport).toBeFalse();
    expect(component.loadingReportCheck).toBeFalse();
    expect(consoleSpy).toHaveBeenCalled();
  }));

  it('getNewReportButtonText() returns correct text', () => {
    // Loading
    component.loadingReportCheck = true;
    expect(component.getNewReportButtonText()).toBe('Checking Report Availability...');

    // Cannot generate
    component.loadingReportCheck = false;
    component.canGenerateReport = false;
    expect(component.getNewReportButtonText()).toBe('Cannot create new report (Pending)');

    // Can generate
    component.canGenerateReport = true;
    expect(component.getNewReportButtonText()).toBe('Add a New Report');
  });

  it('getPendingReportButtonText() returns correct text', () => {
    component.loadingReportCheck = true;
    expect(component.getPendingReportButtonText()).toBe('Checking Report Availability...');

    component.loadingReportCheck = false;
    component.hasPendingReport = true;
    expect(component.getPendingReportButtonText()).toBe('Current Report');

    component.hasPendingReport = false;
    expect(component.getPendingReportButtonText()).toBe('No Pending Report');
  });

  it('newReport() should call ReportService and navigate', fakeAsync(() => {
    const mockReport: ReportDto = { id: 'r1', userId: 'u1', month: '2025-11-01', posted: false };
    reportServiceSpy.createNewReport.and.returnValue(of(mockReport));
    const navigateSpy = spyOn(router, 'navigate');

    component.newReport();
    tick();

    expect(reportServiceSpy.createNewReport).toHaveBeenCalled();
    expect(navigateSpy).toHaveBeenCalledWith(['/report-view', 'r1']);
  }));

  it('newReport() handles error', fakeAsync(() => {
    const consoleSpy = spyOn(console, 'error');
    const alertSpy = spyOn(window, 'alert');
    reportServiceSpy.createNewReport.and.returnValue(throwError(() => new Error('Fail')));

    component.newReport();
    tick();

    expect(reportServiceSpy.createNewReport).toHaveBeenCalled();
    expect(consoleSpy).toHaveBeenCalled();
    expect(alertSpy).toHaveBeenCalledWith('Failed to create new report. See console for details.');
  }));

  it('pendingReport() navigates if report exists', fakeAsync(() => {
    const mockReport: ReportDto = { id: 'r2', userId: 'u1', month: '2025-11-01', posted: false };
    reportServiceSpy.getNextPendingReport.and.returnValue(of(mockReport));
    const navigateSpy = spyOn(router, 'navigate');

    component.pendingReport();
    tick();

    expect(reportServiceSpy.getNextPendingReport).toHaveBeenCalled();
    expect(navigateSpy).toHaveBeenCalledWith(['/report-view', 'r2']);
  }));

  it('pendingReport() alerts if no pending report', fakeAsync(() => {
    reportServiceSpy.getNextPendingReport.and.returnValue(of(null));
    const alertSpy = spyOn(window, 'alert');

    component.pendingReport();
    tick();

    expect(alertSpy).toHaveBeenCalledWith('No pending reports available.');
  }));

  it('pendingReport() handles error', fakeAsync(() => {
    reportServiceSpy.getNextPendingReport.and.returnValue(throwError(() => new Error('Fail')));
    const consoleSpy = spyOn(console, 'error');
    const alertSpy = spyOn(window, 'alert');

    component.pendingReport();
    tick();

    expect(consoleSpy).toHaveBeenCalled();
    expect(alertSpy).toHaveBeenCalledWith('Failed to fetch next pending report. See console for details.');
  }));
});
