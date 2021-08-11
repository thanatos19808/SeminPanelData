import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExternoExpedienteComponent } from './externo-expediente.component';

describe('ExternoExpedienteComponent', () => {
  let component: ExternoExpedienteComponent;
  let fixture: ComponentFixture<ExternoExpedienteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExternoExpedienteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExternoExpedienteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
