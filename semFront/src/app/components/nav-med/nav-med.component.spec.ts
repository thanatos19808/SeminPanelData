import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NavMedComponent } from './nav-med.component';

describe('NavMedComponent', () => {
  let component: NavMedComponent;
  let fixture: ComponentFixture<NavMedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NavMedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NavMedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
