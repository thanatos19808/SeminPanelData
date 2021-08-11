import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NavbusComponent } from './navbus.component';

describe('NavbusComponent', () => {
  let component: NavbusComponent;
  let fixture: ComponentFixture<NavbusComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NavbusComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NavbusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
