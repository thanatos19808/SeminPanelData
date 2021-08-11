import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormDocumentsComponent } from './form-documents.component';

describe('FormDocumentsComponent', () => {
  let component: FormDocumentsComponent;
  let fixture: ComponentFixture<FormDocumentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormDocumentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormDocumentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
