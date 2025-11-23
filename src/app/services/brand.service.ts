// brand.service.ts
import { Injectable } from '@angular/core';
import { BackendConfig } from '../config/backend-config';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BrandDto } from '../dto/brand.dto';
import { BrandCreateDto } from '../dto/brand-create.dto';

@Injectable({
  providedIn: 'root'
})
export class BrandService {
  private apiUrl = `${BackendConfig.springApiUrl}/brands`;

  constructor(private http: HttpClient) {}

  /**
   * Get all brands belonging to the current user
   */
  getBrandsByUser(): Observable<BrandDto[]> {
    return this.http.get<BrandDto[]>(this.apiUrl);
  }

  /**
   * Create a new brand for the current user
   */
  createBrand(payload: BrandCreateDto): Observable<BrandDto> {
    return this.http.post<BrandDto>(this.apiUrl, payload);
  }
}
