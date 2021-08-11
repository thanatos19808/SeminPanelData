import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MedicoAjustesComponent } from './medico-ajustes.component';

describe('MedicoAjustesComponent', () => {
  let component: MedicoAjustesComponent;
  let fixture: ComponentFixture<MedicoAjustesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MedicoAjustesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MedicoAjustesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
