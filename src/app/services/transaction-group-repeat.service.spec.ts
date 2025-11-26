import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TransactionGroupRepeatService } from './transaction-group-repeat.service';
import { BackendConfig } from '../config/backend-config';
import { TransactionGroupDto } from '../dto/transaction-group.dto';

describe('TransactionGroupRepeatService', () => {
  let service: TransactionGroupRepeatService;
  let httpMock: HttpTestingController;
  const apiUrl = `${BackendConfig.springApiUrl}/repeat-groups`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [TransactionGroupRepeatService]
    });
    service = TestBed.inject(TransactionGroupRepeatService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify(); // ensure no outstanding requests
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should mark group as repeat', () => {
    const mockGroup: TransactionGroupDto = { id: 'group1', transactions: [] };

    service.markAsRepeat('group1').subscribe(res => {
      expect(res).toEqual(mockGroup);
    });

    const req = httpMock.expectOne(`${apiUrl}/group1`);
    expect(req.request.method).toBe('POST');
    req.flush(mockGroup);
  });

  it('should check if group is repeat', () => {
    service.isRepeat('group1').subscribe(res => {
      expect(res).toBeTrue();
    });

    const req = httpMock.expectOne(`${apiUrl}/group1/is-repeat`);
    expect(req.request.method).toBe('GET');
    req.flush(true);
  });

  it('should remove repeat status', () => {
    service.removeRepeat('group1').subscribe(res => {
      expect(res).toBe('Removed');
    });

    const req = httpMock.expectOne(`${apiUrl}/group1`);
    expect(req.request.method).toBe('DELETE');
    req.flush('Removed');
  });
});
