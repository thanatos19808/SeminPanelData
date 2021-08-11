import { TestBed } from '@angular/core/testing';

import { PanelDataService } from './panel-data.service';

describe('PanelDataService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PanelDataService = TestBed.get(PanelDataService);
    expect(service).toBeTruthy();
  });
});
