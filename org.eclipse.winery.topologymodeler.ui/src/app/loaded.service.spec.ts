import { TestBed, inject } from '@angular/core/testing';

import { LoadedService } from './loaded.service';

describe('LoadedService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LoadedService]
    });
  });

  it('should be created', inject([LoadedService], (service: LoadedService) => {
    expect(service).toBeTruthy();
  }));
});
