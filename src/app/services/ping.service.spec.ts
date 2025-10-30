import { TestBed } from '@angular/core/testing';

import { PingService } from './ping.service';
import {provideHttpClient} from '@angular/common/http';
import {HttpTestingController, provideHttpClientTesting} from '@angular/common/http/testing';

describe('PingService', () => {
  let service: PingService;
  let httpMock: any; // HttpTestingController

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),         // provide HttpClient
        provideHttpClientTesting()   // provide HttpTestingController
      ],
    });
    service = TestBed.inject(PingService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('ping() should call /ping and return text', (done) => {
    service.ping().subscribe(result => {
      expect(result).toBe('pong');
      done();
    });

    const req = httpMock.expectOne(`${service['apiUrl']}/ping`);
    expect(req.request.method).toBe('GET');
    req.flush('pong');
  });
});
