import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Cie10Component } from './cie10.component';

describe('Cie10Component', () => {
  let component: Cie10Component;
  let fixture: ComponentFixture<Cie10Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Cie10Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Cie10Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
