import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductividadPanelDataComponent } from './productividad-panel-data.component';

describe('ProductividadPanelDataComponent', () => {
  let component: ProductividadPanelDataComponent;
  let fixture: ComponentFixture<ProductividadPanelDataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductividadPanelDataComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductividadPanelDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
