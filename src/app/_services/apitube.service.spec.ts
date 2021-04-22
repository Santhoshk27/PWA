import { TestBed } from '@angular/core/testing';

import { ApitubeService } from './apitube.service';

describe('ApitubeService', () => {
  let service: ApitubeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApitubeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
