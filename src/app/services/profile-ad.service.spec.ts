import { TestBed } from '@angular/core/testing';

import { ProfileAdService } from './profile-ad.service';

describe('ProfileAdService', () => {
  let service: ProfileAdService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProfileAdService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
