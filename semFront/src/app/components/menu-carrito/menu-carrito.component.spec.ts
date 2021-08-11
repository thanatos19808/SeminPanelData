import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuCarritoComponent } from './menu-carrito.component';

describe('MenuCarritoComponent', () => {
  let component: MenuCarritoComponent;
  let fixture: ComponentFixture<MenuCarritoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MenuCarritoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MenuCarritoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
