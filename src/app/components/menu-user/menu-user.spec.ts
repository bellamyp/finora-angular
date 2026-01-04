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
    const spy = jasmine.createSpyObj('ReportService', ['createNewReport', 'canGenerateNewReport']);

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

  it('should call checkReportAvailability() on init', fakeAsync(() => {
    reportServiceSpy.canGenerateNewReport.and.returnValue(of(true));
    fixture.detectChanges(); // triggers ngOnInit
    tick();
    expect(component.canGenerateReport).toBeTrue();
    expect(component.loadingReportCheck).toBeFalse();
  }));

  it('should handle checkReportAvailability() error', fakeAsync(() => {
    reportServiceSpy.canGenerateNewReport.and.returnValue(throwError(() => new Error('Fail')));
    const consoleSpy = spyOn(console, 'error');
    fixture.detectChanges(); // triggers ngOnInit
    tick();
    expect(component.canGenerateReport).toBeFalse();
    expect(component.loadingReportCheck).toBeFalse();
    expect(consoleSpy).toHaveBeenCalled();
  }));

  it('getNewReportButtonText() should return proper text', fakeAsync(() => {
    reportServiceSpy.canGenerateNewReport.and.returnValue(of(true));

    // Loading state
    component.loadingReportCheck = true;
    expect(component.getNewReportButtonText()).toBe('Checking Report Availability...');

    // Cannot generate
    component.loadingReportCheck = false;
    component.canGenerateReport = false;
    expect(component.getNewReportButtonText()).toBe('Cannot create new report (Pending)');

    // Can generate
    component.canGenerateReport = true;
    expect(component.getNewReportButtonText()).toBe('Add a New Report');
  }));

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
    const alertSpy = spyOn(window, 'alert');
    reportServiceSpy.createNewReport.and.returnValue(throwError(() => new Error('Failed')));

    component.newReport();
    tick();

    expect(reportServiceSpy.createNewReport).toHaveBeenCalled();
    expect(consoleSpy).toHaveBeenCalled();
    expect(alertSpy).toHaveBeenCalledWith('Failed to create new report. See console for details.');
  }));
});
