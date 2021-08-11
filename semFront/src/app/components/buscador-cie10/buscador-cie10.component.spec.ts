import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BuscadorCie10Component } from './buscador-cie10.component';

describe('BuscadorCie10Component', () => {
  let component: BuscadorCie10Component;
  let fixture: ComponentFixture<BuscadorCie10Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BuscadorCie10Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BuscadorCie10Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
