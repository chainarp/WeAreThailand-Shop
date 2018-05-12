import { TestBed, inject } from '@angular/core/testing';

import { CustomerLocationServiceProvider } from './customer-location-service';

describe('RESTClientService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CustomerLocationServiceProvider]
    });
  });

  it('should be created', inject([CustomerLocationServiceProvider], (service: CustomerLocationServiceProvider) => {
    expect(service).toBeTruthy();
  }));
});
