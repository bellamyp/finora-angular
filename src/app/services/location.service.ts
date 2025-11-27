// location.service.ts
import { Injectable } from '@angular/core';
import { BackendConfig } from '../config/backend-config';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LocationDto } from '../dto/location.dto';
import { LocationCreateDto } from '../dto/location-create.dto';

@Injectable({
  providedIn: 'root'
})
export class LocationService {
  private apiUrl = `${BackendConfig.springApiUrl}/locations`;

  constructor(private http: HttpClient) {}

  /**
   * Get all locations
   */
  getLocations(): Observable<LocationDto[]> {
    return this.http.get<LocationDto[]>(this.apiUrl);
  }

  /**
   * Create a new location
   */
  createLocation(payload: LocationCreateDto): Observable<LocationDto> {
    return this.http.post<LocationDto>(this.apiUrl, payload);
  }
}
