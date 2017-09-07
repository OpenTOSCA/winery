import { TestBed, inject } from '@angular/core/testing';

import { AppReadyEventService } from './app-ready-event.service';

describe('AppReadyEventService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AppReadyEventService]
    });
  });

  it('should be created', inject([AppReadyEventService], (service: AppReadyEventService) => {
    expect(service).toBeTruthy();
  }));
});
