import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MedicoPacienteComponent } from './medico-paciente.component';

describe('MedicoPacienteComponent', () => {
  let component: MedicoPacienteComponent;
  let fixture: ComponentFixture<MedicoPacienteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MedicoPacienteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MedicoPacienteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
