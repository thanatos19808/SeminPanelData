import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FinanzasPanelDataComponent } from './finanzas-panel-data.component';

describe('FinanzasPanelDataComponent', () => {
  let component: FinanzasPanelDataComponent;
  let fixture: ComponentFixture<FinanzasPanelDataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FinanzasPanelDataComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FinanzasPanelDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
