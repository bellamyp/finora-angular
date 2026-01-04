import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ReportList } from './report-list';
import { ReportService } from '../../services/report.service';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { ReportDto } from '../../dto/report.dto';
import { By } from '@angular/platform-browser';
import { Component } from '@angular/core';
import { provideRouter } from '@angular/router';

// Dummy component for routing
@Component({ template: '', standalone: true })
class DummyComponent {}

describe('ReportList', () => {
  let component: ReportList;
  let fixture: ComponentFixture<ReportList>;
  let reportServiceSpy: jasmine.SpyObj<ReportService>;
  let router: Router;

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('ReportService', ['getAllReports']);

    await TestBed.configureTestingModule({
      imports: [ReportList, DummyComponent],
      providers: [
        { provide: ReportService, useValue: spy },
        provideRouter([{ path: 'report-view/:id', component: DummyComponent }])
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ReportList);
    component = fixture.componentInstance;
    reportServiceSpy = TestBed.inject(ReportService) as jasmine.SpyObj<ReportService>;
    router = TestBed.inject(Router);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load reports successfully', fakeAsync(() => {
    const mockReports: ReportDto[] = [
      { id: 'r1', userId: 'u1', month: '2025-11-01', posted: true },
      { id: 'r2', userId: 'u2', month: '2025-12-01', posted: false }
    ];
    reportServiceSpy.getAllReports.and.returnValue(of(mockReports));

    fixture.detectChanges(); // triggers ngOnInit
    tick();

    expect(component.loading).toBeFalse();
    expect(component.reports).toEqual(mockReports);

    // check table rows rendered
    fixture.detectChanges();
    const rows = fixture.debugElement.queryAll(By.css('tbody tr'));
    expect(rows.length).toBe(2);

    const firstStatus = rows[0].query(By.css('td:nth-child(2) span')).nativeElement.textContent.trim();
    expect(firstStatus).toBe('Posted');

    const secondStatus = rows[1].query(By.css('td:nth-child(2) span')).nativeElement.textContent.trim();
    expect(secondStatus).toBe('Pending');
  }));

  it('should handle load reports error', fakeAsync(() => {
    reportServiceSpy.getAllReports.and.returnValue(throwError(() => new Error('Failed')));
    const consoleSpy = spyOn(console, 'error');

    fixture.detectChanges(); // triggers ngOnInit
    tick();

    expect(component.loading).toBeFalse();
    expect(component.error).toBe('Failed to load reports');
    expect(consoleSpy).toHaveBeenCalled();
  }));

  it('viewReport() should navigate to report view', () => {
    const report: ReportDto = { id: 'r1', userId: 'u1', month: '2025-11-01', posted: true };
    const navigateSpy = spyOn(router, 'navigate');

    component.viewReport(report);

    expect(navigateSpy).toHaveBeenCalledWith(['/report-view', 'r1']);
  });

  it('should show empty state when no reports', fakeAsync(() => {
    reportServiceSpy.getAllReports.and.returnValue(of([]));

    fixture.detectChanges();
    tick();
    fixture.detectChanges();

    const emptyDiv = fixture.debugElement.query(By.css('.text-center.text-muted.fs-5'));
    expect(emptyDiv).toBeTruthy();
    expect(emptyDiv.nativeElement.textContent).toContain('No reports available');
  }));
});
