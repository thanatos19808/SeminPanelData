import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadRehabilitacionComponent } from './upload-rehabilitacion.component';

describe('UploadRehabilitacionComponent', () => {
  let component: UploadRehabilitacionComponent;
  let fixture: ComponentFixture<UploadRehabilitacionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UploadRehabilitacionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadRehabilitacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
