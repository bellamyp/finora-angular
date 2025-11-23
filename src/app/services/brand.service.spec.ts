import { TestBed } from '@angular/core/testing';
import { BrandService } from './brand.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { BrandDto } from '../dto/brand.dto';
import { BrandCreateDto } from '../dto/brand-create.dto';
import { BackendConfig } from '../config/backend-config';

describe('BrandService', () => {
  let service: BrandService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [BrandService]
    });
    service = TestBed.inject(BrandService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify(); // Ensure no outstanding requests
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch brands by user', () => {
    const mockBrands: BrandDto[] = [
      { id: 'b1', name: 'Nike', location: 'Houston' }
    ];

    service.getBrandsByUser().subscribe((brands) => {
      expect(brands.length).toBe(1);
      expect(brands[0].name).toBe('Nike');
    });

    const req = httpMock.expectOne(`${BackendConfig.springApiUrl}/brands`);
    expect(req.request.method).toBe('GET');
    req.flush(mockBrands);
  });

  it('should create a brand', () => {
    const payload: BrandCreateDto = { name: 'Adidas', location: 'Dallas' };
    const mockResponse: BrandDto = { id: 'b2', name: 'Adidas', location: 'Dallas' };

    service.createBrand(payload).subscribe((brand) => {
      expect(brand.id).toBe('b2');
      expect(brand.name).toBe('Adidas');
    });

    const req = httpMock.expectOne(`${BackendConfig.springApiUrl}/brands`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(payload);
    req.flush(mockResponse);
  });
});
