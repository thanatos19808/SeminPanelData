import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuPromocionesComponent } from './menu-promociones.component';

describe('MenuPromocionesComponent', () => {
  let component: MenuPromocionesComponent;
  let fixture: ComponentFixture<MenuPromocionesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MenuPromocionesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MenuPromocionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
