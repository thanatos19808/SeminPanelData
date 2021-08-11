import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalErrorAlertComponent } from './modal-error-alert.component';

describe('ModalErrorAlertComponent', () => {
  let component: ModalErrorAlertComponent;
  let fixture: ComponentFixture<ModalErrorAlertComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalErrorAlertComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalErrorAlertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
