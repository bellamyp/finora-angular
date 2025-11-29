import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { BankGroupService } from './bank-group.service';
import { BackendConfig } from '../config/backend-config';
import { BankGroupDto } from '../dto/bank-group.dto';
import { BankGroupCreateDto } from '../dto/bank-group-create.dto';

describe('BankGroupService', () => {
  let service: BankGroupService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [BankGroupService]
    });
    service = TestBed.inject(BankGroupService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify(); // ensure no outstanding requests
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  // ----------------------------------------
  // GET /bank-groups
  // ----------------------------------------
  it('should fetch all bank groups', () => {
    const mockGroups: BankGroupDto[] = [
      { id: 'G1', name: 'Group A' },
      { id: 'G2', name: 'Group B' }
    ];

    service.getBankGroups().subscribe(groups => {
      expect(groups.length).toBe(2);
      expect(groups[0].id).toBe('G1');
      expect(groups[0].name).toBe('Group A');
      expect(groups[1].id).toBe('G2');
      expect(groups[1].name).toBe('Group B');
    });

    const req = httpMock.expectOne(`${BackendConfig.springApiUrl}/bank-groups`);
    expect(req.request.method).toBe('GET');
    req.flush(mockGroups);
  });

  it('should handle error when fetching bank groups', () => {
    const errorMessage = 'Network error';

    service.getBankGroups().subscribe({
      next: () => fail('should have failed'),
      error: (error) => {
        expect(error.statusText).toBe('Network error');
      }
    });

    const req = httpMock.expectOne(`${BackendConfig.springApiUrl}/bank-groups`);
    expect(req.request.method).toBe('GET');
    req.flush({}, { status: 500, statusText: 'Network error' });
  });

  // ----------------------------------------
  // POST /bank-groups
  // ----------------------------------------
  it('should create a new bank group', () => {
    const payload: BankGroupCreateDto = { name: 'New Group' };
    const mockResponse: BankGroupDto = { id: 'G100', name: 'New Group' };

    service.createBankGroup(payload).subscribe(group => {
      expect(group.id).toBe('G100');
      expect(group.name).toBe('New Group');
    });

    const req = httpMock.expectOne(`${BackendConfig.springApiUrl}/bank-groups`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(payload);
    req.flush(mockResponse);
  });

  it('should handle error when creating bank group', () => {
    const payload: BankGroupCreateDto = { name: 'Fail Group' };

    service.createBankGroup(payload).subscribe({
      next: () => fail('should have failed'),
      error: (error) => {
        expect(error.statusText).toBe('Bad Request');
      }
    });

    const req = httpMock.expectOne(`${BackendConfig.springApiUrl}/bank-groups`);
    expect(req.request.method).toBe('POST');
    req.flush({}, { status: 400, statusText: 'Bad Request' });
  });
});
