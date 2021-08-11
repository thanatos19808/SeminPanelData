import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VentasPanelDataComponent } from './ventas-panel-data.component';

describe('VentasPanelDataComponent', () => {
  let component: VentasPanelDataComponent;
  let fixture: ComponentFixture<VentasPanelDataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VentasPanelDataComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VentasPanelDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
