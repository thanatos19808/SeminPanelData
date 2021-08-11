import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OperadorImagenologiaComponent } from './operador-imagenologia.component';

describe('OperadorImagenologiaComponent', () => {
  let component: OperadorImagenologiaComponent;
  let fixture: ComponentFixture<OperadorImagenologiaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OperadorImagenologiaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OperadorImagenologiaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
