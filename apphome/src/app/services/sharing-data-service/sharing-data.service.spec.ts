import { TestBed, inject } from '@angular/core/testing';

import { SharingDataServiceProvider } from './sharing-data.service';

describe('RESTClientService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SharingDataServiceProvider]
    });
  });

  it('should be created', inject([SharingDataServiceProvider], (service: SharingDataServiceProvider) => {
    expect(service).toBeTruthy();
  }));
});
