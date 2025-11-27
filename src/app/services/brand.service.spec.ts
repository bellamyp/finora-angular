import { TestBed } from '@angular/core/testing';
import { BrandService } from './brand.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { BrandDto } from '../dto/brand.dto';
import { BrandCreateDto } from '../dto/brand-create.dto';
import { BackendConfig } from '../config/backend-config';

describe('BrandService', () => {
  let service: BrandService;
  let httpMock: HttpTestingController;

  const baseUrl = `${BackendConfig.springApiUrl}/brands`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [BrandService]
    });

    service = TestBed.inject(BrandService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch brands by user', () => {
    const mockBrands: BrandDto[] = [
      { id: 'b1', name: 'Nike' }
    ];

    service.getBrandsByUser().subscribe((brands) => {
      expect(brands.length).toBe(1);
      expect(brands[0].id).toBe('b1');
      expect(brands[0].name).toBe('Nike');
    });

    const req = httpMock.expectOne(baseUrl);
    expect(req.request.method).toBe('GET');
    req.flush(mockBrands);
  });

  it('should create a new brand', () => {
    const payload: BrandCreateDto = { name: 'Adidas' };
    const mockResponse: BrandDto = { id: 'b2', name: 'Adidas'};

    service.createBrand(payload).subscribe((brand) => {
      expect(brand.id).toBe('b2');
      expect(brand.name).toBe('Adidas');
    });

    const req = httpMock.expectOne(baseUrl);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(payload);
    req.flush(mockResponse);
  });

  it('should handle GET request error', () => {
    service.getBrandsByUser().subscribe({
      next: () => fail('should have failed'),
      error: (err) => {
        expect(err.status).toBe(500);
      }
    });

    const req = httpMock.expectOne(baseUrl);
    req.flush('Server error', { status: 500, statusText: 'Internal Server Error' });
  });

  it('should handle POST request error', () => {
    const payload: BrandCreateDto = { name: 'Puma' };

    service.createBrand(payload).subscribe({
      next: () => fail('should have failed'),
      error: (err) => {
        expect(err.status).toBe(400);
      }
    });

    const req = httpMock.expectOne(baseUrl);
    req.flush('Bad Request', { status: 400, statusText: 'Bad Request' });
  });
});
