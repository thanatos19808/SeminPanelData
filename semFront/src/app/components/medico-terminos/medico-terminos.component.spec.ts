import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MedicoTerminosComponent } from './medico-terminos.component';

describe('MedicoTerminosComponent', () => {
  let component: MedicoTerminosComponent;
  let fixture: ComponentFixture<MedicoTerminosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MedicoTerminosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MedicoTerminosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
