import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PacienteExpedienteComponent } from './paciente-expediente.component';

describe('PacienteExpedienteComponent', () => {
  let component: PacienteExpedienteComponent;
  let fixture: ComponentFixture<PacienteExpedienteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PacienteExpedienteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PacienteExpedienteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
