import { TestBed, inject } from '@angular/core/testing';

import { RESTClientService } from './restclient.service';

describe('RESTClientService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RESTClientService]
    });
  });

  it('should be created', inject([RESTClientService], (service: RESTClientService) => {
    expect(service).toBeTruthy();
  }));
});
