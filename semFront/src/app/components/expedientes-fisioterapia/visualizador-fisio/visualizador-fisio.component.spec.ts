import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VisualizadorFisioComponent } from './visualizador-fisio.component';

describe('VisualizadorFisioComponent', () => {
  let component: VisualizadorFisioComponent;
  let fixture: ComponentFixture<VisualizadorFisioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VisualizadorFisioComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VisualizadorFisioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
