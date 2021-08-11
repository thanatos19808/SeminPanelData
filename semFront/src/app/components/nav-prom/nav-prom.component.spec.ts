import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NavPromComponent } from './nav-prom.component';

describe('NavPromComponent', () => {
  let component: NavPromComponent;
  let fixture: ComponentFixture<NavPromComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NavPromComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NavPromComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
