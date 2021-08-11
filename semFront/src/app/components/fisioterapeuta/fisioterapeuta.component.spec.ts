import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FisioterapeutaComponent } from './fisioterapeuta.component';

describe('FisioterapeutaComponent', () => {
  let component: FisioterapeutaComponent;
  let fixture: ComponentFixture<FisioterapeutaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FisioterapeutaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FisioterapeutaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
