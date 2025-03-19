import { TestBed } from '@angular/core/testing';

import { VirtualScrollService } from './virtual-scroll.service';

describe('VirtualScrollService', () => {
  let service: VirtualScrollService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VirtualScrollService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
