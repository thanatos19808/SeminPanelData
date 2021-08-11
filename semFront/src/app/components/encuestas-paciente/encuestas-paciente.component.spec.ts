import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EncuestasPacienteComponent } from './encuestas-paciente.component';

describe('EncuestasPacienteComponent', () => {
  let component: EncuestasPacienteComponent;
  let fixture: ComponentFixture<EncuestasPacienteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EncuestasPacienteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EncuestasPacienteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
