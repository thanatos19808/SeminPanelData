import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MedRegisterComponent } from './med-register.component';

describe('MedRegisterComponent', () => {
  let component: MedRegisterComponent;
  let fixture: ComponentFixture<MedRegisterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MedRegisterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MedRegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
