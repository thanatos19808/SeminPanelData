import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UsuarioImagenologiaComponent } from './usuario-imagenologia.component';

describe('UsuarioImagenologiaComponent', () => {
  let component: UsuarioImagenologiaComponent;
  let fixture: ComponentFixture<UsuarioImagenologiaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UsuarioImagenologiaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UsuarioImagenologiaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
