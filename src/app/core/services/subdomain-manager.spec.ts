import { TestBed } from '@angular/core/testing';

import { SubdomainManager } from './subdomain-manager';

describe('SubdomainManager', () => {
  let service: SubdomainManager;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SubdomainManager);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
