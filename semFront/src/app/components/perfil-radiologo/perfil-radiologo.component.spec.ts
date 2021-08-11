import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PerfilRadiologoComponent } from './perfil-radiologo.component';

describe('PerfilRadiologoComponent', () => {
  let component: PerfilRadiologoComponent;
  let fixture: ComponentFixture<PerfilRadiologoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PerfilRadiologoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PerfilRadiologoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
