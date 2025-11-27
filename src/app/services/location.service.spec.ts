import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { LocationService } from './location.service';
import { BackendConfig } from '../config/backend-config';
import { LocationDto } from '../dto/location.dto';
import { LocationCreateDto } from '../dto/location-create.dto';

describe('LocationService', () => {
  let service: LocationService;
  let httpMock: HttpTestingController;

  const apiUrl = `${BackendConfig.springApiUrl}/locations`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [LocationService]
    });

    service = TestBed.inject(LocationService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify(); // Ensure no outstanding requests
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch all locations via getLocations', () => {
    const mockLocations: LocationDto[] = [
      { id: 'loc1', city: 'New York', state: 'NY' },
      { id: 'loc2', city: 'Los Angeles', state: 'CA' }
    ];

    service.getLocations().subscribe((locations) => {
      expect(locations.length).toBe(2);
      expect(locations).toEqual(mockLocations);
    });

    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('GET');
    req.flush(mockLocations);
  });

  it('should create a new location via createLocation', () => {
    const payload: LocationCreateDto = { city: 'Chicago', state: 'IL' };
    const mockResponse: LocationDto = { id: 'loc3', city: 'Chicago', state: 'IL' };

    service.createLocation(payload).subscribe((location) => {
      expect(location).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(payload);
    req.flush(mockResponse);
  });

  it('should handle error on getLocations', () => {
    service.getLocations().subscribe({
      next: () => fail('Should have failed with 500 error'),
      error: (error) => expect(error.status).toBe(500)
    });

    const req = httpMock.expectOne(apiUrl);
    req.flush('Server error', { status: 500, statusText: 'Internal Server Error' });
  });

  it('should handle error on createLocation', () => {
    const payload: LocationCreateDto = { city: 'Chicago', state: 'IL' };

    service.createLocation(payload).subscribe({
      next: () => fail('Should have failed with 400 error'),
      error: (error) => expect(error.status).toBe(400)
    });

    const req = httpMock.expectOne(apiUrl);
    req.flush('Bad request', { status: 400, statusText: 'Bad Request' });
  });
});
