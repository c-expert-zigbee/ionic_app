import { TestBed } from '@angular/core/testing';

import { MyAdsService } from './my-ads.service';

describe('MyAdsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MyAdsService = TestBed.get(MyAdsService);
    expect(service).toBeTruthy();
  });
});
