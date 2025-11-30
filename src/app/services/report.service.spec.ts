import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ReportService } from './report.service';
import { BackendConfig } from '../config/backend-config';
import { ReportDto } from '../dto/report.dto';

describe('ReportService', () => {
  let service: ReportService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ReportService]
    });

    service = TestBed.inject(ReportService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify(); // ensure no outstanding requests
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call POST /reports/new and return ReportDto', () => {
    const mockReport: ReportDto = {
      id: 'report123',
      userId: 'user123',
      month: '2025-11-01',
      posted: false
    };

    service.createNewReport().subscribe((report) => {
      expect(report).toEqual(mockReport);
    });

    const req = httpMock.expectOne(`${BackendConfig.springApiUrl}/reports/new`);
    expect(req.request.method).toBe('POST');
    req.flush(mockReport); // mock HTTP response
  });
});
