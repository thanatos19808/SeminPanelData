import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BuscadorFisioStudioComponent } from './buscador-fisio-studio.component';

describe('BuscadorFisioStudioComponent', () => {
  let component: BuscadorFisioStudioComponent;
  let fixture: ComponentFixture<BuscadorFisioStudioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BuscadorFisioStudioComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BuscadorFisioStudioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
